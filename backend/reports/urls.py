from django.urls import path
from .views import DownloadPatientReportView, DownloadPrescriptionPDFView, AnalyticsDashboardView

urlpatterns = [
    path("download/", DownloadPatientReportView.as_view(), name="report-download"),
    path("download/<int:prediction_id>/", DownloadPatientReportView.as_view(), name="report-download-prediction"),
    path("prescription/<int:prescription_id>/", DownloadPrescriptionPDFView.as_view(), name="prescription-download"),
    path("analytics/", AnalyticsDashboardView.as_view(), name="analytics"),
]
