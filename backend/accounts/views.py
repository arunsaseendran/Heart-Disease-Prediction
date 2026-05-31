from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import User
from .serializers import (
    RegisterSerializer, LoginSerializer,
    UserSerializer, ChangePasswordSerializer,
)
from .permissions import IsAdminRole


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "Registration successful.", "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password changed successfully."})


class AdminUserListView(generics.ListAPIView):
    """Admin: List all users"""
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]
    queryset = User.objects.all().order_by("-created_at")


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Manage individual users"""
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]
    queryset = User.objects.all()


class AdminToggleUserView(APIView):
    """Admin: Activate/deactivate user accounts"""
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            status_text = "activated" if user.is_active else "deactivated"
            return Response({"message": f"User {status_text} successfully."})
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )


class DashboardStatsView(APIView):
    """Admin: Dashboard statistics"""
    permission_classes = [IsAdminRole]

    def get(self, request):
        from predictions.models import Prediction
        from appointments.models import Appointment

        stats = {
            "total_users": User.objects.count(),
            "patients_count": User.objects.filter(role="patient").count(),
            "doctors_count": User.objects.filter(role="doctor").count(),
            "predictions_count": Prediction.objects.count(),
            # Fallbacks
            "total_patients": User.objects.filter(role="patient").count(),
            "total_doctors": User.objects.filter(role="doctor").count(),
            "total_predictions": Prediction.objects.count(),
            "high_risk_patients": Prediction.objects.filter(risk_level="high").count(),
            "total_appointments": Appointment.objects.count(),
            "pending_appointments": Appointment.objects.filter(status="pending").count(),
        }
        return Response(stats)
