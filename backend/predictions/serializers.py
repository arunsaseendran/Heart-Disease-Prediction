from rest_framework import serializers
from .models import Prediction
from patients.serializers import HealthRecordSerializer


class PredictionSerializer(serializers.ModelSerializer):
    health_record_data = HealthRecordSerializer(source="health_record", read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Prediction
        fields = "__all__"
        read_only_fields = [
            "patient", "prediction_result", "probability", "risk_level",
            "diet_recommendations", "exercise_recommendations",
            "alert_message", "smoking_advice", "created_at",
        ]

    def get_patient_name(self, obj):
        return str(obj.patient)


class PredictRequestSerializer(serializers.Serializer):
    """Accepts health data + optional algorithm choice for direct prediction"""
    age = serializers.IntegerField(min_value=1, max_value=120)
    sex = serializers.IntegerField(min_value=0, max_value=1)
    chest_pain_type = serializers.IntegerField(min_value=0, max_value=3)
    resting_blood_pressure = serializers.IntegerField(min_value=60, max_value=300)
    cholesterol = serializers.IntegerField(min_value=100, max_value=600)
    fasting_blood_sugar = serializers.IntegerField(min_value=0, max_value=1)
    resting_ecg = serializers.IntegerField(min_value=0, max_value=2)
    max_heart_rate = serializers.IntegerField(min_value=50, max_value=250)
    exercise_induced_angina = serializers.IntegerField(min_value=0, max_value=1)
    st_depression = serializers.FloatField(min_value=0, max_value=10)
    st_slope = serializers.IntegerField(min_value=0, max_value=2)
    num_major_vessels = serializers.IntegerField(min_value=0, max_value=3)
    thalassemia = serializers.IntegerField(min_value=0, max_value=2)
    smoking = serializers.BooleanField(default=False)
    algorithm = serializers.CharField(default="best", required=False)
    save_record = serializers.BooleanField(default=True)
