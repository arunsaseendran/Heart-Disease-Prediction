from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from patients.models import PatientProfile
from predictions.models import Prediction
from appointments.models import Appointment
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def generate_patient_report_pdf(patient: PatientProfile, prediction: Prediction = None) -> bytes:
    """Generate a professional PDF health report for a patient."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title", parent=styles["Title"],
        fontSize=22, textColor=colors.HexColor("#1a1a2e"),
        alignment=TA_CENTER, spaceAfter=6,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle", parent=styles["Normal"],
        fontSize=11, textColor=colors.HexColor("#e94560"),
        alignment=TA_CENTER, spaceAfter=20,
    )
    heading_style = ParagraphStyle(
        "Heading", parent=styles["Heading2"],
        fontSize=14, textColor=colors.HexColor("#1a1a2e"),
        spaceBefore=16, spaceAfter=8,
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"],
        fontSize=10, leading=16,
    )

    story = []

    # Header
    story.append(Paragraph("❤️ HeartCare AI", title_style))
    story.append(Paragraph("Heart Disease Prediction & Healthcare Management", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#e94560")))
    story.append(Spacer(1, 16))

    # Patient Info
    user = patient.user
    story.append(Paragraph("Patient Information", heading_style))
    info_data = [
        ["Full Name", user.get_full_name() or user.username],
        ["Username", user.username],
        ["Email", user.email],
        ["Phone", user.phone or "N/A"],
        ["Date of Birth", str(user.date_of_birth) if user.date_of_birth else "N/A"],
        ["Gender", user.gender.title() if user.gender else "N/A"],
        ["Blood Group", patient.blood_group or "N/A"],
    ]
    info_table = Table(info_data, colWidths=[2.5 * inch, 4 * inch])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f4f8")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#f9f9f9")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(info_table)

    if prediction:
        story.append(Spacer(1, 20))
        story.append(Paragraph("Prediction Results", heading_style))

        risk_colors = {
            "low": colors.HexColor("#27ae60"),
            "medium": colors.HexColor("#f39c12"),
            "high": colors.HexColor("#e74c3c"),
        }
        risk_color = risk_colors.get(prediction.risk_level, colors.black)

        pred_data = [
            ["Risk Level", prediction.risk_level.upper()],
            ["Probability", f"{prediction.probability:.1f}%"],
            ["Algorithm Used", prediction.algorithm_used.replace("_", " ").title()],
            ["Prediction Date", prediction.created_at.strftime("%Y-%m-%d %H:%M")],
        ]
        pred_table = Table(pred_data, colWidths=[2.5 * inch, 4 * inch])
        pred_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f4f8")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#f9f9f9")]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
            ("PADDING", (0, 0), (-1, -1), 8),
            ("TEXTCOLOR", (1, 0), (1, 0), risk_color),
            ("FONTNAME", (1, 0), (1, 0), "Helvetica-Bold"),
        ]))
        story.append(pred_table)

        # Health Data
        if prediction.health_record:
            rec = prediction.health_record
            story.append(Spacer(1, 16))
            story.append(Paragraph("Health Data", heading_style))
            health_data = [
                ["Age", str(rec.age)],
                ["Blood Pressure", f"{rec.resting_blood_pressure} mm Hg"],
                ["Cholesterol", f"{rec.cholesterol} mg/dl"],
                ["Max Heart Rate", str(rec.max_heart_rate)],
                ["Fasting Blood Sugar", "High (>120 mg/dl)" if rec.fasting_blood_sugar else "Normal"],
                ["Exercise Angina", "Yes" if rec.exercise_induced_angina else "No"],
                ["ST Depression", str(rec.st_depression)],
                ["Smoking", "Yes" if rec.smoking else "No"],
            ]
            health_table = Table(health_data, colWidths=[2.5 * inch, 4 * inch])
            health_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f4f8")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#f9f9f9")]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]))
            story.append(health_table)

        # Recommendations
        story.append(Spacer(1, 16))
        story.append(Paragraph("Recommendations", heading_style))
        story.append(Paragraph(f"<b>Alert:</b> {prediction.alert_message}", body_style))
        story.append(Spacer(1, 8))

        story.append(Paragraph("<b>Diet Recommendations:</b>", body_style))
        for item in prediction.diet_recommendations[:5]:
            story.append(Paragraph(f"• {item}", body_style))
        story.append(Spacer(1, 8))

        story.append(Paragraph("<b>Exercise Recommendations:</b>", body_style))
        for item in prediction.exercise_recommendations[:4]:
            story.append(Paragraph(f"• {item}", body_style))

    # Footer
    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#dddddd")))
    story.append(Paragraph(
        "Generated by HeartCare AI | This report is for informational purposes only.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8,
                       textColor=colors.grey, alignment=TA_CENTER),
    ))

    doc.build(story)
    return buffer.getvalue()


class DownloadPatientReportView(APIView):
    """Patient/Doctor: Download PDF health report"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, prediction_id=None):
        user = request.user
        if user.role == "patient":
            profile, _ = PatientProfile.objects.get_or_create(user=user)
            prediction = None
            if prediction_id:
                try:
                    prediction = Prediction.objects.get(id=prediction_id, patient=profile)
                except Prediction.DoesNotExist:
                    return Response({"error": "Prediction not found."}, status=404)
        else:
            patient_id = request.query_params.get("patient_id")
            if not patient_id:
                return Response({"error": "patient_id required."}, status=400)
            try:
                profile = PatientProfile.objects.get(id=patient_id)
            except PatientProfile.DoesNotExist:
                return Response({"error": "Patient not found."}, status=404)
            prediction = None
            if prediction_id:
                try:
                    prediction = Prediction.objects.get(id=prediction_id, patient=profile)
                except Prediction.DoesNotExist:
                    pass

        pdf_bytes = generate_patient_report_pdf(profile, prediction)

        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        filename = f"heartcare_report_{profile.user.username}.pdf"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response


class AnalyticsDashboardView(APIView):
    """Admin: Analytics for dashboard"""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from accounts.models import User
        from django.db.models import Count
        from django.db.models.functions import TruncMonth
        import datetime

        # Monthly predictions
        monthly = (
            Prediction.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )

        # Risk distribution
        risk_dist = (
            Prediction.objects.values("risk_level")
            .annotate(count=Count("id"))
        )

        return Response({
            "monthly_predictions": [
                {"month": str(m["month"]), "count": m["count"]} for m in monthly
            ],
            "risk_distribution": list(risk_dist),
            "total_users": User.objects.count(),
            "total_patients": User.objects.filter(role="patient").count(),
            "total_doctors": User.objects.filter(role="doctor").count(),
        })
