from django.urls import path
from .views import (
    TrainModelsView, ModelComparisonView, ModelListView,
    DatasetUploadView, DatasetListView,
)

urlpatterns = [
    path("train/", TrainModelsView.as_view(), name="train-models"),
    path("comparison/", ModelComparisonView.as_view(), name="model-comparison"),
    path("models/", ModelListView.as_view(), name="model-list"),
    path("datasets/upload/", DatasetUploadView.as_view(), name="dataset-upload"),
    path("datasets/", DatasetListView.as_view(), name="dataset-list"),
]
