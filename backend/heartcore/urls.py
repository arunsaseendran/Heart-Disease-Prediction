"""
URL configuration for heartcore project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("api/auth/", include("accounts.urls")),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Main modules
    path("api/patients/", include("patients.urls")),
    path("api/doctors/", include("doctors.urls")),
    path("api/predictions/", include("predictions.urls")),
    path("api/appointments/", include("appointments.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/ml/", include("ml_engine.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
