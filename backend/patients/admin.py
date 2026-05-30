from django.contrib import admin
from .models import PatientProfile, HealthRecord, Notification

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "blood_group", "assigned_doctor", "created_at"]
    search_fields = ["user__username", "user__email"]

@admin.register(HealthRecord)
class HealthRecordAdmin(admin.ModelAdmin):
    list_display = ["patient", "age", "cholesterol", "max_heart_rate", "recorded_at"]
    list_filter = ["smoking", "alcohol"]

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "type", "title", "is_read", "created_at"]
    list_filter = ["type", "is_read"]
