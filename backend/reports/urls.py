from django.urls import path
from .views import DownloadPatientReportView, AnalyticsDashboardView

urlpatterns = [
    path("download/", DownloadPatientReportView.as_view(), name="report-download"),
    path("download/<int:prediction_id>/", DownloadPatientReportView.as_view(), name="report-download-prediction"),
    path("analytics/", AnalyticsDashboardView.as_view(), name="analytics"),
]
