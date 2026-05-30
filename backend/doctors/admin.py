from django.contrib import admin
from .models import DoctorProfile, DoctorAvailability, Prescription

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "specialization", "license_number", "experience_years", "is_available"]
    list_filter = ["specialization", "is_available"]
    search_fields = ["user__username", "license_number"]

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ["doctor", "patient", "created_at"]
    search_fields = ["doctor__user__username", "patient__user__username"]
