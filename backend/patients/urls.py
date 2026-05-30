from django.urls import path
from .views import (
    PatientProfileView, PatientListView, PatientDetailView,
    AssignDoctorView, HealthRecordListCreateView, HealthRecordDetailView,
    NotificationListView, MarkNotificationReadView,
)

urlpatterns = [
    path("profile/", PatientProfileView.as_view(), name="patient-profile"),
    path("", PatientListView.as_view(), name="patient-list"),
    path("<int:pk>/", PatientDetailView.as_view(), name="patient-detail"),
    path("<int:pk>/assign-doctor/", AssignDoctorView.as_view(), name="assign-doctor"),
    path("health-records/", HealthRecordListCreateView.as_view(), name="health-records"),
    path("health-records/<int:pk>/", HealthRecordDetailView.as_view(), name="health-record-detail"),
    path("notifications/", NotificationListView.as_view(), name="notifications"),
    path("notifications/<int:pk>/read/", MarkNotificationReadView.as_view(), name="notification-read"),
]
