from django.db import models
from accounts.models import User


class DoctorProfile(models.Model):
    """Extended profile for doctors"""
    SPECIALIZATION_CHOICES = [
        ("cardiologist", "Cardiologist"),
        ("general_physician", "General Physician"),
        ("internist", "Internist"),
        ("cardiac_surgeon", "Cardiac Surgeon"),
        ("electrophysiologist", "Electrophysiologist"),
        ("other", "Other"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor_profile")
    specialization = models.CharField(
        max_length=50, choices=SPECIALIZATION_CHOICES, default="general_physician"
    )
    license_number = models.CharField(max_length=100, unique=True)
    experience_years = models.IntegerField(default=0)
    hospital_name = models.CharField(max_length=200, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False, help_text="Admin must approve before doctor appears in appointment booking")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "doctor_profiles"

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username}"


class DoctorAvailability(models.Model):
    DAY_CHOICES = [
        (0, "Monday"), (1, "Tuesday"), (2, "Wednesday"),
        (3, "Thursday"), (4, "Friday"), (5, "Saturday"), (6, "Sunday"),
    ]
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name="availability"
    )
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_appointments = models.IntegerField(default=10)

    class Meta:
        db_table = "doctor_availability"
        unique_together = ["doctor", "day_of_week"]

    def __str__(self):
        return f"{self.doctor} - {self.get_day_of_week_display()}"


class Prescription(models.Model):
    """Doctor writes prescriptions for patients"""
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name="prescriptions"
    )
    patient = models.ForeignKey(
        "patients.PatientProfile", on_delete=models.CASCADE, related_name="prescriptions"
    )
    diagnosis = models.TextField()
    medications = models.TextField(help_text="List of medications")
    dosage_instructions = models.TextField()
    notes = models.TextField(blank=True)
    recommended_tests = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "prescriptions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Rx by {self.doctor} for {self.patient}"
