from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PatientProfile, HealthRecord, Notification
from .serializers import PatientProfileSerializer, HealthRecordSerializer, NotificationSerializer


class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "patient"


class IsAdminOrDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["admin", "doctor"]


class PatientProfileView(generics.RetrieveUpdateAPIView):
    """Patient: View and update own profile"""
    serializer_class = PatientProfileSerializer
    permission_classes = [IsPatient]

    def get_object(self):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save()


class PatientListView(generics.ListAPIView):
    """Admin/Doctor: List all patients"""
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAdminOrDoctor]
    queryset = PatientProfile.objects.select_related("user", "assigned_doctor").all()


class PatientDetailView(generics.RetrieveAPIView):
    """Admin/Doctor: View specific patient"""
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAdminOrDoctor]
    queryset = PatientProfile.objects.all()


class AssignDoctorView(APIView):
    """Admin: Assign a doctor to a patient"""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            patient = PatientProfile.objects.get(pk=pk)
            doctor_id = request.data.get("doctor_id")
            from accounts.models import User
            doctor = User.objects.get(pk=doctor_id, role="doctor")
            patient.assigned_doctor = doctor
            patient.save()
            return Response({"message": "Doctor assigned successfully."})
        except (PatientProfile.DoesNotExist, User.DoesNotExist):
            return Response({"error": "Patient or doctor not found."}, status=404)


class HealthRecordListCreateView(generics.ListCreateAPIView):
    """Patient: List and create health records"""
    serializer_class = HealthRecordSerializer
    permission_classes = [IsPatient]

    def get_queryset(self):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return HealthRecord.objects.filter(patient=profile)

    def perform_create(self, serializer):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        serializer.save(patient=profile)


class HealthRecordDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == "patient":
            profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
            return HealthRecord.objects.filter(patient=profile)
        return HealthRecord.objects.all()


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
            notif.is_read = True
            notif.save()
            return Response({"message": "Notification marked as read."})
        except Notification.DoesNotExist:
            return Response({"error": "Not found."}, status=404)
