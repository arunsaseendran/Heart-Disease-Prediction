from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import PatientProfile, HealthRecord, Notification


class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_doctor_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientProfile
        fields = "__all__"

    def get_assigned_doctor_name(self, obj):
        if obj.assigned_doctor:
            return obj.assigned_doctor.get_full_name() or obj.assigned_doctor.username
        return None

    def get_patient_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = "__all__"
        read_only_fields = ["patient"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["user", "created_at"]
