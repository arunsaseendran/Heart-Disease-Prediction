from django.db import models
from accounts.models import User


class PatientProfile(models.Model):
    """Extended profile for patients"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient_profile")
    blood_group = models.CharField(max_length=10, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    assigned_doctor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_patients",
        limit_choices_to={"role": "doctor"},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "patient_profiles"

    def __str__(self):
        return f"Patient: {self.user.get_full_name() or self.user.username}"


class HealthRecord(models.Model):
    """Periodic health data entry by patient"""
    patient = models.ForeignKey(
        PatientProfile, on_delete=models.CASCADE, related_name="health_records"
    )
    recorded_at = models.DateTimeField(auto_now_add=True)

    # Medical parameters
    age = models.IntegerField()
    sex = models.IntegerField(help_text="1=Male, 0=Female")
    chest_pain_type = models.IntegerField(
        help_text="0=Typical Angina, 1=Atypical Angina, 2=Non-anginal Pain, 3=Asymptomatic"
    )
    resting_blood_pressure = models.IntegerField(help_text="mm Hg")
    cholesterol = models.IntegerField(help_text="mg/dl")
    fasting_blood_sugar = models.IntegerField(
        help_text="1 if > 120 mg/dl, else 0"
    )
    resting_ecg = models.IntegerField(
        help_text="0=Normal, 1=ST-T abnormality, 2=Left ventricular hypertrophy"
    )
    max_heart_rate = models.IntegerField()
    exercise_induced_angina = models.IntegerField(help_text="1=Yes, 0=No")
    st_depression = models.FloatField(help_text="ST depression induced by exercise")
    st_slope = models.IntegerField(
        help_text="0=Upsloping, 1=Flat, 2=Downsloping"
    )
    num_major_vessels = models.IntegerField(help_text="0-3")
    thalassemia = models.IntegerField(
        help_text="0=Normal, 1=Fixed Defect, 2=Reversible Defect"
    )

    # Lifestyle
    smoking = models.BooleanField(default=False)
    alcohol = models.BooleanField(default=False)
    physical_activity = models.CharField(
        max_length=20,
        choices=[("sedentary", "Sedentary"), ("moderate", "Moderate"), ("active", "Active")],
        default="moderate",
    )

    class Meta:
        db_table = "health_records"
        ordering = ["-recorded_at"]

    def __str__(self):
        return f"Health record for {self.patient} at {self.recorded_at}"


class Notification(models.Model):
    TYPES = [
        ("medicine", "Medicine Reminder"),
        ("appointment", "Appointment Reminder"),
        ("emergency", "Emergency Alert"),
        ("general", "General"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=20, choices=TYPES, default="general")
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
