from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Appointment
from .serializers import AppointmentSerializer
from accounts.permissions import IsAdminRole
from patients.models import PatientProfile
from doctors.models import DoctorProfile


class PatientAppointmentListCreateView(generics.ListCreateAPIView):
    """Patient: Book and view appointments"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "patient":
            profile, _ = PatientProfile.objects.get_or_create(user=user)
            return Appointment.objects.filter(patient=profile)
        if user.role == "doctor":
            profile = DoctorProfile.objects.get(user=user)
            return Appointment.objects.filter(doctor=profile)
        return Appointment.objects.all()

    def perform_create(self, serializer):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        blood_group = serializer.validated_data.pop("blood_group", None)
        if blood_group:
            profile.blood_group = blood_group
            profile.save()
        serializer.save(patient=profile)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Appointment.objects.all()


class DoctorAppointmentActionView(APIView):
    """Doctor: Accept/reject appointments"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            appt = Appointment.objects.get(pk=pk)
            action = request.data.get("action")  # confirm | reject | complete
            if action not in ["confirm", "reject", "complete"]:
                return Response({"error": "Invalid action."}, status=400)

            status_map = {"confirm": "confirmed", "reject": "rejected", "complete": "completed"}
            appt.status = status_map[action]
            appt.doctor_notes = request.data.get("notes", "")
            appt.save()

            if action == "confirm":
                patient_profile = appt.patient
                patient_profile.assigned_doctor = appt.doctor.user
                patient_profile.save()

            # Notify patient
            from patients.models import Notification
            Notification.objects.create(
                user=appt.patient.user,
                type="appointment",
                title=f"Appointment {appt.status.title()}",
                message=f"Your appointment on {appt.appointment_date} has been {appt.status}.",
            )
            return Response({"message": f"Appointment {appt.status}.", "status": appt.status})
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found."}, status=404)


class AdminAppointmentListView(generics.ListAPIView):
    """Admin: View all appointments"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminRole]
    queryset = Appointment.objects.all()
