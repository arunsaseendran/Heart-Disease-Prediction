from django.db import models


class MLModel(models.Model):
    """Tracks trained ML models"""
    name = models.CharField(max_length=100)
    algorithm = models.CharField(max_length=100)
    accuracy = models.FloatField(default=0)
    precision = models.FloatField(default=0)
    recall = models.FloatField(default=0)
    f1_score = models.FloatField(default=0)
    cv_mean = models.FloatField(default=0)
    cv_std = models.FloatField(default=0)
    is_best = models.BooleanField(default=False)
    trained_at = models.DateTimeField(auto_now=True)
    dataset_size = models.IntegerField(default=0)

    class Meta:
        db_table = "ml_models"
        ordering = ["-accuracy"]

    def __str__(self):
        return f"{self.name} ({self.accuracy:.1f}% accuracy)"


class Dataset(models.Model):
    """Uploaded datasets for training"""
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to="datasets/")
    rows = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "datasets"

    def __str__(self):
        return self.name
