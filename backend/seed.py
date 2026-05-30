"""
Seed script: Creates demo admin, doctors, patients, and trains ML models.
Run: python3 seed.py
"""
import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "heartcore.settings")
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

from accounts.models import User
from patients.models import PatientProfile
from doctors.models import DoctorProfile
from ml_engine.engine import train_all_models

def main():
    print("🌱 Seeding Heart Disease Prediction System...")

    # Create superadmin
    if not User.objects.filter(username="admin").exists():
        admin = User.objects.create_superuser(
            username="admin",
            email="admin@heartcare.com",
            password="Admin@123",
            first_name="System",
            last_name="Admin",
            role="admin",
        )
        print(f"✅ Admin created: admin / Admin@123")

    # Create doctors
    doctors_data = [
        {"username": "dr_sharma", "email": "sharma@heartcare.com", "first_name": "Rajesh", "last_name": "Sharma",
         "specialization": "cardiologist", "license_number": "CARD-001", "experience_years": 15},
        {"username": "dr_patel", "email": "patel@heartcare.com", "first_name": "Priya", "last_name": "Patel",
         "specialization": "general_physician", "license_number": "GP-002", "experience_years": 8},
        {"username": "dr_kumar", "email": "kumar@heartcare.com", "first_name": "Amit", "last_name": "Kumar",
         "specialization": "internist", "license_number": "INT-003", "experience_years": 12},
    ]

    for d in doctors_data:
        if not User.objects.filter(username=d["username"]).exists():
            user = User.objects.create_user(
                username=d["username"], email=d["email"],
                password="Doctor@123", first_name=d["first_name"],
                last_name=d["last_name"], role="doctor",
            )
            DoctorProfile.objects.create(
                user=user,
                specialization=d["specialization"],
                license_number=d["license_number"],
                experience_years=d["experience_years"],
                hospital_name="HeartCare Medical Center",
                consultation_fee=800.00,
            )
            print(f"✅ Doctor created: {d['username']} / Doctor@123")

    # Create patients
    patients_data = [
        {"username": "patient1", "email": "p1@heartcare.com", "first_name": "Rahul", "last_name": "Verma"},
        {"username": "patient2", "email": "p2@heartcare.com", "first_name": "Sunita", "last_name": "Singh"},
        {"username": "patient3", "email": "p3@heartcare.com", "first_name": "Mohan", "last_name": "Das"},
    ]

    for p in patients_data:
        if not User.objects.filter(username=p["username"]).exists():
            user = User.objects.create_user(
                username=p["username"], email=p["email"],
                password="Patient@123", first_name=p["first_name"],
                last_name=p["last_name"], role="patient",
            )
            PatientProfile.objects.create(user=user, blood_group="A+")
            print(f"✅ Patient created: {p['username']} / Patient@123")

    # Train ML models
    print("\n🤖 Training ML models (this may take a moment)...")
    results = train_all_models()
    print(f"✅ All models trained! Best model: {results['best_model']}")
    for algo, metrics in results["results"].items():
        print(f"   {algo:25s}: Accuracy={metrics['accuracy']}%, F1={metrics['f1_score']}%")

    print("\n✅ Seeding complete!")
    print("\n📋 Login credentials:")
    print("   Admin:   admin / Admin@123")
    print("   Doctor:  dr_sharma / Doctor@123")
    print("   Patient: patient1 / Patient@123")

if __name__ == "__main__":
    main()
