from django.urls import path
from .views import (
    PatientAppointmentListCreateView, AppointmentDetailView,
    DoctorAppointmentActionView, AdminAppointmentListView,
)

urlpatterns = [
    path("", PatientAppointmentListCreateView.as_view(), name="appointment-list"),
    path("<int:pk>/", AppointmentDetailView.as_view(), name="appointment-detail"),
    path("<int:pk>/action/", DoctorAppointmentActionView.as_view(), name="appointment-action"),
    path("admin/all/", AdminAppointmentListView.as_view(), name="admin-appointments"),
]
