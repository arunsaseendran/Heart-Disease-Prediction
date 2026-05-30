from django.db import models
from patients.models import PatientProfile, HealthRecord


class Prediction(models.Model):
    RISK_LEVELS = [
        ("low", "Low Risk"),
        ("medium", "Medium Risk"),
        ("high", "High Risk"),
    ]

    patient = models.ForeignKey(
        PatientProfile, on_delete=models.CASCADE, related_name="predictions"
    )
    health_record = models.OneToOneField(
        HealthRecord, on_delete=models.CASCADE, related_name="prediction",
        null=True, blank=True,
    )
    algorithm_used = models.CharField(max_length=100, default="best")
    prediction_result = models.IntegerField(help_text="1=Disease, 0=No Disease")
    probability = models.FloatField(help_text="Probability of heart disease in %")
    risk_level = models.CharField(max_length=20, choices=RISK_LEVELS)

    # Recommendations
    diet_recommendations = models.JSONField(default=list)
    exercise_recommendations = models.JSONField(default=list)
    alert_message = models.TextField(blank=True)
    smoking_advice = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "predictions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Prediction for {self.patient} - {self.risk_level}"
