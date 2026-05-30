from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Prediction
from .serializers import PredictionSerializer, PredictRequestSerializer
from patients.models import PatientProfile, HealthRecord
from ml_engine.engine import predict as ml_predict, get_recommendations
from accounts.permissions import IsAdminRole


class PredictView(APIView):
    """
    Patient: Submit health data and get heart disease prediction.
    Optionally saves health record and prediction to history.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PredictRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            result = ml_predict(data, model_name=data.get("algorithm", "best"))
        except FileNotFoundError:
            return Response(
                {"error": "ML models not trained yet. Please contact admin."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        recs = get_recommendations(result["risk_level"], data)

        if request.user.role == "patient" and data.get("save_record", True):
            profile, _ = PatientProfile.objects.get_or_create(user=request.user)

            # Update blood group if provided
            blood_group = data.get("blood_group")
            if blood_group:
                profile.blood_group = blood_group
                profile.save()

            # Save health record
            health_fields = {k: v for k, v in data.items()
                             if k not in ["algorithm", "save_record", "smoking", "blood_group"]}
            health_fields["smoking"] = data.get("smoking", False)
            health_record = HealthRecord.objects.create(patient=profile, **health_fields)

            # Save prediction
            prediction = Prediction.objects.create(
                patient=profile,
                health_record=health_record,
                algorithm_used=data.get("algorithm", "best"),
                prediction_result=result["prediction"],
                probability=result["probability"],
                risk_level=result["risk_level"],
                diet_recommendations=recs["diet"],
                exercise_recommendations=recs["exercise"],
                alert_message=recs["alert"],
                smoking_advice=recs["smoking_advice"],
            )

            # Send high-risk notification
            if result["risk_level"] == "high":
                from patients.models import Notification
                Notification.objects.create(
                    user=request.user,
                    type="emergency",
                    title="⚠️ High Heart Disease Risk Detected",
                    message=recs["alert"],
                )

            return Response({
                **result,
                "recommendations": recs,
                "prediction_id": prediction.id,
            })

        return Response({**result, "recommendations": recs})


class PredictionHistoryView(generics.ListAPIView):
    """Patient: View prediction history"""
    serializer_class = PredictionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "patient":
            profile, _ = PatientProfile.objects.get_or_create(user=user)
            return Prediction.objects.filter(patient=profile)
        if user.role in ["doctor", "admin"]:
            patient_id = self.request.query_params.get("patient_id")
            if patient_id:
                return Prediction.objects.filter(patient_id=patient_id)
            return Prediction.objects.all()
        return Prediction.objects.none()


class PredictionDetailView(generics.RetrieveAPIView):
    serializer_class = PredictionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Prediction.objects.all()


class AdminPredictionStatsView(APIView):
    """Admin: Overall prediction statistics"""
    permission_classes = [IsAdminRole]

    def get(self, request):
        total = Prediction.objects.count()
        high = Prediction.objects.filter(risk_level="high").count()
        medium = Prediction.objects.filter(risk_level="medium").count()
        low = Prediction.objects.filter(risk_level="low").count()

        recent_preds = Prediction.objects.all().order_by("-created_at")[:100]
        recent_serialized = PredictionSerializer(recent_preds, many=True).data

        return Response({
            "total_predictions": total,
            "high_risk": high,
            "medium_risk": medium,
            "low_risk": low,
            "high_risk_count": high,
            "medium_risk_count": medium,
            "low_risk_count": low,
            "high_risk_percentage": round((high / total * 100) if total else 0, 1),
            "recent": recent_serialized,
        })
