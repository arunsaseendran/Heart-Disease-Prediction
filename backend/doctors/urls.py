from django.urls import path
from .views import (
    DoctorListView, DoctorDetailView, DoctorProfileView,
    AdminDoctorCreateView, DoctorAvailabilityView,
    DoctorPatientsView, PrescriptionListCreateView,
    PrescriptionDetailView, PatientPrescriptionsView,
    AdminPendingDoctorsView, AdminApproveDoctorView,
)

urlpatterns = [
    path("", DoctorListView.as_view(), name="doctor-list"),
    path("<int:pk>/", DoctorDetailView.as_view(), name="doctor-detail"),
    path("profile/", DoctorProfileView.as_view(), name="doctor-profile"),
    path("admin/create/", AdminDoctorCreateView.as_view(), name="admin-doctor-create"),
    path("admin/pending/", AdminPendingDoctorsView.as_view(), name="admin-pending-doctors"),
    path("admin/approve/<int:pk>/", AdminApproveDoctorView.as_view(), name="admin-approve-doctor"),
    path("availability/", DoctorAvailabilityView.as_view(), name="doctor-availability"),
    path("patients/", DoctorPatientsView.as_view(), name="doctor-patients"),
    path("prescriptions/", PrescriptionListCreateView.as_view(), name="prescription-list"),
    path("prescriptions/<int:pk>/", PrescriptionDetailView.as_view(), name="prescription-detail"),
    path("my-prescriptions/", PatientPrescriptionsView.as_view(), name="my-prescriptions"),
]
