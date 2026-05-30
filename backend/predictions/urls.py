from django.urls import path
from .views import (
    PredictView, PredictionHistoryView, PredictionDetailView,
    AdminPredictionStatsView,
)

urlpatterns = [
    path("predict/", PredictView.as_view(), name="predict"),
    path("history/", PredictionHistoryView.as_view(), name="prediction-history"),
    path("<int:pk>/", PredictionDetailView.as_view(), name="prediction-detail"),
    path("admin/stats/", AdminPredictionStatsView.as_view(), name="prediction-stats"),
]
