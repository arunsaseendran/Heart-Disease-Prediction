"""
ML Engine Core: Heart Disease Prediction using multiple algorithms.

Algorithms: Logistic Regression, Decision Tree, Random Forest,
SVM, KNN, Naive Bayes, XGBoost
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from pathlib import Path
from datetime import datetime

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

MODELS_DIR = Path(__file__).parent / "saved_models"
MODELS_DIR.mkdir(exist_ok=True)

ALGORITHM_MAP = {
    "logistic_regression": LogisticRegression(max_iter=1000, random_state=42),
    "decision_tree": DecisionTreeClassifier(random_state=42),
    "random_forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "svm": SVC(kernel="rbf", probability=True, random_state=42),
    "knn": KNeighborsClassifier(n_neighbors=5),
    "naive_bayes": GaussianNB(),
    "xgboost": XGBClassifier(
        n_estimators=100, learning_rate=0.1, random_state=42,
        eval_metric="logloss", use_label_encoder=False
    ),
}

FEATURE_COLUMNS = [
    "age", "sex", "chest_pain_type", "resting_blood_pressure",
    "cholesterol", "fasting_blood_sugar", "resting_ecg",
    "max_heart_rate", "exercise_induced_angina", "st_depression",
    "st_slope", "num_major_vessels", "thalassemia",
]


def get_sample_data():
    """Generate sample heart disease dataset for demo/training"""
    np.random.seed(42)
    n = 1000

    data = {
        "age": np.random.randint(29, 77, n),
        "sex": np.random.randint(0, 2, n),
        "chest_pain_type": np.random.randint(0, 4, n),
        "resting_blood_pressure": np.random.randint(94, 200, n),
        "cholesterol": np.random.randint(126, 564, n),
        "fasting_blood_sugar": np.random.randint(0, 2, n),
        "resting_ecg": np.random.randint(0, 3, n),
        "max_heart_rate": np.random.randint(71, 202, n),
        "exercise_induced_angina": np.random.randint(0, 2, n),
        "st_depression": np.round(np.random.uniform(0, 6.2, n), 1),
        "st_slope": np.random.randint(0, 3, n),
        "num_major_vessels": np.random.randint(0, 4, n),
        "thalassemia": np.random.randint(0, 3, n),
    }

    # Simulate realistic target
    score = (
        (data["age"] > 55).astype(int) * 2
        + (data["sex"] == 1).astype(int)
        + (data["chest_pain_type"] == 0).astype(int) * 2
        + (data["cholesterol"] > 240).astype(int)
        + (data["fasting_blood_sugar"] == 1).astype(int)
        + (data["exercise_induced_angina"] == 1).astype(int) * 2
        + (data["st_depression"] > 2).astype(int)
        + (data["num_major_vessels"] > 1).astype(int)
    )
    data["target"] = (score >= 4).astype(int)
    return pd.DataFrame(data)


def train_all_models(df: pd.DataFrame = None):
    """Train all ML algorithms and save models + scaler + results."""
    if df is None:
        df = get_sample_data()

    X = df[FEATURE_COLUMNS].values
    y = df["target"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    # Save scaler
    joblib.dump(scaler, MODELS_DIR / "scaler.pkl")

    results = {}
    best_model_name = None
    best_accuracy = 0.0

    for name, model in ALGORITHM_MAP.items():
        model.fit(X_train_sc, y_train)
        y_pred = model.predict(X_test_sc)

        acc = round(accuracy_score(y_test, y_pred) * 100, 2)
        prec = round(precision_score(y_test, y_pred, zero_division=0) * 100, 2)
        rec = round(recall_score(y_test, y_pred, zero_division=0) * 100, 2)
        f1 = round(f1_score(y_test, y_pred, zero_division=0) * 100, 2)
        cm = confusion_matrix(y_test, y_pred).tolist()
        cv_scores = cross_val_score(model, X_train_sc, y_train, cv=5, scoring="accuracy")

        results[name] = {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "confusion_matrix": cm,
            "cv_mean": round(cv_scores.mean() * 100, 2),
            "cv_std": round(cv_scores.std() * 100, 2),
        }

        # Save model
        joblib.dump(model, MODELS_DIR / f"{name}.pkl")

        if acc > best_accuracy:
            best_accuracy = acc
            best_model_name = name

    # Save results and best model info
    results_data = {
        "results": results,
        "best_model": best_model_name,
        "trained_at": datetime.now().isoformat(),
        "dataset_size": len(df),
        "features": FEATURE_COLUMNS,
    }
    with open(MODELS_DIR / "training_results.json", "w") as f:
        json.dump(results_data, f, indent=2)

    # Save best model separately for fast predictions
    best_model = joblib.load(MODELS_DIR / f"{best_model_name}.pkl")
    joblib.dump(best_model, MODELS_DIR / "best_model.pkl")

    return results_data


def get_training_results():
    """Load saved training results."""
    results_path = MODELS_DIR / "training_results.json"
    if not results_path.exists():
        return None
    with open(results_path) as f:
        return json.load(f)


def predict(features: dict, model_name: str = "best"):
    """
    Make heart disease prediction.
    Returns: { prediction: 0|1, probability: float, risk_level: str }
    """
    scaler_path = MODELS_DIR / "scaler.pkl"
    model_path = (
        MODELS_DIR / "best_model.pkl"
        if model_name == "best"
        else MODELS_DIR / f"{model_name}.pkl"
    )

    if not scaler_path.exists() or not model_path.exists():
        raise FileNotFoundError("Models not trained yet. Please train models first.")

    scaler = joblib.load(scaler_path)
    model = joblib.load(model_path)

    # Build feature vector
    feature_vector = np.array(
        [[features.get(col, 0) for col in FEATURE_COLUMNS]]
    )
    feature_scaled = scaler.transform(feature_vector)

    prediction = int(model.predict(feature_scaled)[0])
    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(feature_scaled)[0][1])
    else:
        probability = float(prediction)

    # Risk categorization
    if probability < 0.35:
        risk_level = "low"
    elif probability < 0.65:
        risk_level = "medium"
    else:
        risk_level = "high"

    return {
        "prediction": prediction,
        "probability": round(probability * 100, 1),
        "risk_level": risk_level,
        "has_disease": bool(prediction),
    }


def get_recommendations(risk_level: str, features: dict) -> dict:
    """Generate lifestyle and diet recommendations based on risk."""
    base_diet = [
        "Eat a heart-healthy diet rich in fruits, vegetables, and whole grains",
        "Limit sodium intake to less than 2,300 mg per day",
        "Choose lean proteins like fish, poultry, and legumes",
        "Avoid trans fats and limit saturated fats",
        "Stay hydrated with water instead of sugary beverages",
    ]
    base_exercise = [
        "Aim for at least 150 minutes of moderate aerobic activity per week",
        "Include strength training 2 days per week",
        "Walk for 30 minutes daily",
        "Avoid prolonged sitting; take movement breaks",
    ]

    if risk_level == "high":
        specific_diet = [
            "⚠️ Strictly follow a low-cholesterol, low-sodium diet",
            "Consult a dietitian for a personalized meal plan",
            "Limit red meat consumption",
            "Avoid alcohol completely",
        ]
        specific_exercise = [
            "⚠️ Consult your doctor before starting any exercise program",
            "Start with light walking under medical supervision",
            "Avoid high-intensity exercises until cleared by doctor",
        ]
        alert = "⚠️ High risk detected. Please consult a cardiologist immediately."
    elif risk_level == "medium":
        specific_diet = [
            "Reduce processed and junk food intake",
            "Monitor your cholesterol levels regularly",
            "Include omega-3 rich foods like salmon and walnuts",
        ]
        specific_exercise = [
            "Moderate exercise 5 days a week",
            "Consider swimming, cycling, or yoga",
            "Monitor heart rate during exercise",
        ]
        alert = "⚠️ Medium risk. Lifestyle changes recommended. Schedule a check-up."
    else:
        specific_diet = [
            "Maintain your current healthy diet",
            "Include antioxidant-rich foods",
        ]
        specific_exercise = [
            "Continue regular physical activity",
            "Try adding variety to your exercise routine",
        ]
        alert = "✅ Low risk. Keep maintaining a healthy lifestyle!"

    return {
        "alert": alert,
        "diet": base_diet + specific_diet,
        "exercise": base_exercise + specific_exercise,
        "smoking_advice": (
            "🚭 Quit smoking immediately - it doubles heart disease risk."
            if features.get("smoking")
            else "✅ Keep up the smoke-free lifestyle."
        ),
    }
