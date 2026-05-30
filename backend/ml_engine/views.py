from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import serializers
from .models import MLModel, Dataset
from .engine import train_all_models, get_training_results, predict as ml_predict
import pandas as pd
from accounts.permissions import IsAdminRole


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = "__all__"


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = "__all__"


class TrainModelsView(APIView):
    """Admin: Train all ML models"""
    permission_classes = [IsAdminRole]

    def post(self, request):
        try:
            dataset_id = request.data.get("dataset_id")
            df = None

            if dataset_id:
                dataset = Dataset.objects.get(pk=dataset_id)
                df = pd.read_csv(dataset.file.path)

            results_data = train_all_models(df)

            # Persist results to DB
            MLModel.objects.all().update(is_best=False)
            for algo, metrics in results_data["results"].items():
                MLModel.objects.update_or_create(
                    algorithm=algo,
                    defaults={
                        "name": algo.replace("_", " ").title(),
                        "accuracy": metrics["accuracy"],
                        "precision": metrics["precision"],
                        "recall": metrics["recall"],
                        "f1_score": metrics["f1_score"],
                        "cv_mean": metrics["cv_mean"],
                        "cv_std": metrics["cv_std"],
                        "dataset_size": results_data["dataset_size"],
                        "is_best": algo == results_data["best_model"],
                    },
                )

            return Response({
                "message": "All models trained successfully.",
                "best_model": results_data["best_model"],
                "results": results_data["results"],
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ModelComparisonView(APIView):
    """Get training results and algorithm comparison"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        results = get_training_results()
        if results:
            return Response(results)
        # Fall back to DB
        models = MLModel.objects.all()
        return Response(MLModelSerializer(models, many=True).data)


class ModelListView(generics.ListAPIView):
    serializer_class = MLModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MLModel.objects.all()


class DatasetUploadView(APIView):
    """Admin: Upload training dataset"""
    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided."}, status=400)
        try:
            df = pd.read_csv(file)
            file.seek(0)
            dataset = Dataset.objects.create(
                name=request.data.get("name", file.name),
                file=file,
                rows=len(df),
            )
            return Response(DatasetSerializer(dataset).data, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class DatasetListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = DatasetSerializer
    queryset = Dataset.objects.all()
