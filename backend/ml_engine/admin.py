from django.contrib import admin
from .models import MLModel, Dataset

@admin.register(MLModel)
class MLModelAdmin(admin.ModelAdmin):
    list_display = ["name", "algorithm", "accuracy", "precision", "f1_score", "is_best", "trained_at"]
    list_filter = ["is_best"]

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ["name", "rows", "uploaded_at", "is_active"]
