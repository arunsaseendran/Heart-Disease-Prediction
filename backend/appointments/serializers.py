from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    blood_group = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ["patient", "status", "doctor_notes", "created_at", "updated_at"]

    def get_patient_name(self, obj):
        user = obj.patient.user
        return user.get_full_name() or user.username

    def get_doctor_name(self, obj):
        user = obj.doctor.user
        return user.get_full_name() or user.username
