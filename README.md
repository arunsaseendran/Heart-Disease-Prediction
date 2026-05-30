# HeartCare AI — Heart Disease Prediction & Healthcare Management System

A full-stack AI-powered healthcare system built with **React.js** (frontend) and **Python Django** (backend), featuring **7 machine learning algorithms** for heart disease prediction.

## 🚀 Quick Start

```bash
# Run both servers
bash start.sh
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin

## 🔑 Demo Credentials

| Role    | Username   | Password    |
|---------|------------|-------------|
| Admin   | admin      | Admin@123   |
| Doctor  | dr_sharma  | Doctor@123  |
| Patient | patient1   | Patient@123 |

## 🤖 ML Algorithms & Accuracy

| Algorithm          | Accuracy |
|--------------------|----------|
| XGBoost            | 96.0%    |
| Random Forest      | 94.5%    |
| Decision Tree      | 93.0%    |
| Naive Bayes        | 90.5%    |
| SVM                | 89.5%    |
| Logistic Regression| 89.5%    |
| KNN                | 85.0%    |

## 📁 Project Structure

```
Heart Disease Prediction and Health Care/
├── backend/                  # Django REST API
│   ├── accounts/             # User auth & management
│   ├── patients/             # Patient profiles, health records
│   ├── doctors/              # Doctor profiles, prescriptions
│   ├── predictions/          # ML prediction results
│   ├── appointments/         # Appointment booking
│   ├── reports/              # PDF generation
│   ├── ml_engine/            # ML training & inference
│   └── seed.py               # Demo data + model training
└── frontend/                 # React + Vite
    └── src/
        ├── pages/
        │   ├── admin/        # Admin dashboard, ML, users
        │   ├── doctor/       # Doctor portal
        │   └── patient/      # Patient portal
        ├── components/       # Sidebar, Layout
        └── context/          # Auth context
```

## ⚙️ Manual Setup

**Backend:**
```bash
cd backend
python3 manage.py migrate
python3 seed.py        # creates demo users + trains ML models
python3 manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
