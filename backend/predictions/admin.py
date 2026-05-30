from django.contrib import admin
from .models import Prediction

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ["patient", "risk_level", "probability", "algorithm_used", "created_at"]
    list_filter = ["risk_level", "algorithm_used"]
    search_fields = ["patient__user__username"]
