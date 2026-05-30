from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DoctorProfile, DoctorAvailability, Prescription
from .serializers import DoctorProfileSerializer, DoctorAvailabilitySerializer, PrescriptionSerializer
from patients.models import PatientProfile
from patients.serializers import PatientProfileSerializer


class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "doctor"


class DoctorListView(generics.ListAPIView):
    """Public: List all available doctors"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = DoctorProfile.objects.filter(is_available=True).select_related("user")


class DoctorDetailView(generics.RetrieveAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = DoctorProfile.objects.all()


class DoctorProfileView(generics.RetrieveUpdateAPIView):
    """Doctor: Manage own profile"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsDoctor]

    def get_object(self):
        profile, _ = DoctorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={"license_number": f"LIC-{self.request.user.id}"},
        )
        return profile


class AdminDoctorCreateView(generics.CreateAPIView):
    """Admin: Add a new doctor"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        # Create user first, then doctor profile
        from accounts.serializers import RegisterSerializer
        user_data = {
            "username": request.data.get("username"),
            "email": request.data.get("email"),
            "first_name": request.data.get("first_name", ""),
            "last_name": request.data.get("last_name", ""),
            "password": request.data.get("password", "Doctor@123"),
            "password2": request.data.get("password", "Doctor@123"),
            "role": "doctor",
            "phone": request.data.get("phone", ""),
        }
        user_ser = RegisterSerializer(data=user_data)
        user_ser.is_valid(raise_exception=True)
        user = user_ser.save()

        profile_data = {
            "specialization": request.data.get("specialization", "general_physician"),
            "license_number": request.data.get("license_number", f"LIC-{user.id}"),
            "experience_years": request.data.get("experience_years", 0),
            "hospital_name": request.data.get("hospital_name", ""),
            "consultation_fee": request.data.get("consultation_fee", 500),
        }
        profile = DoctorProfile.objects.create(user=user, **profile_data)
        return Response(DoctorProfileSerializer(profile).data, status=status.HTTP_201_CREATED)


class DoctorAvailabilityView(generics.ListCreateAPIView):
    serializer_class = DoctorAvailabilitySerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        profile = DoctorProfile.objects.get(user=self.request.user)
        return DoctorAvailability.objects.filter(doctor=profile)

    def perform_create(self, serializer):
        profile = DoctorProfile.objects.get(user=self.request.user)
        serializer.save(doctor=profile)


class DoctorPatientsView(generics.ListAPIView):
    """Doctor: View assigned patients"""
    serializer_class = PatientProfileSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return PatientProfile.objects.filter(assigned_doctor=self.request.user)


class PrescriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        profile = DoctorProfile.objects.get(user=self.request.user)
        return Prescription.objects.filter(doctor=profile)

    def perform_create(self, serializer):
        profile = DoctorProfile.objects.get(user=self.request.user)
        serializer.save(doctor=profile)


class PrescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        profile = DoctorProfile.objects.get(user=self.request.user)
        return Prescription.objects.filter(doctor=profile)


class PatientPrescriptionsView(generics.ListAPIView):
    """Patient: View their prescriptions"""
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return Prescription.objects.filter(patient=profile)
