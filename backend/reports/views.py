from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from patients.models import PatientProfile
from predictions.models import Prediction
from appointments.models import Appointment
import io
from accounts.permissions import IsAdminRole
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def generate_patient_report_pdf(patient: PatientProfile, prediction: Prediction = None) -> bytes:
    """Generate a highly premium, professional PDF health report for a patient."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        "BrandTitle", parent=styles["Normal"],
        fontSize=18, leading=22, textColor=colors.white,
        fontName="Helvetica-Bold"
    )
    subtitle_style = ParagraphStyle(
        "BrandSubtitle", parent=styles["Normal"],
        fontSize=10, leading=14, textColor=colors.HexColor("#94a3b8"),
        fontName="Helvetica"
    )
    heading_style = ParagraphStyle(
        "SectionHeading", parent=styles["Heading2"],
        fontSize=12, leading=16, textColor=colors.HexColor("#1e1b4b"),
        spaceBefore=14, spaceAfter=6, fontName="Helvetica-Bold"
    )
    label_style = ParagraphStyle(
        "LabelStyle", parent=styles["Normal"],
        fontSize=9, leading=12, textColor=colors.HexColor("#475569"),
        fontName="Helvetica-Bold"
    )
    val_style = ParagraphStyle(
        "ValStyle", parent=styles["Normal"],
        fontSize=9, leading=12, textColor=colors.HexColor("#0f172a"),
        fontName="Helvetica"
    )
    body_style = ParagraphStyle(
        "BodyTextCustom", parent=styles["Normal"],
        fontSize=9.5, leading=14, textColor=colors.HexColor("#334155")
    )
    alert_text_style = ParagraphStyle(
        "AlertText", parent=styles["Normal"],
        fontSize=9.5, leading=14, textColor=colors.HexColor("#be123c"),
        fontName="Helvetica-Bold"
    )

    story = []

    # 1. Premium Brand Header Table
    header_content = [
        [
            Paragraph("HEARTCARE AI CLINICAL WORKSPACE", title_style),
            Paragraph("System-Generated Diagnostic Log", ParagraphStyle("HeaderRight", parent=styles["Normal"], fontSize=8, leading=10, textColor=colors.HexColor("#94a3b8"), alignment=2))
        ],
        [
            Paragraph("High-Fidelity Cardiovascular Risk Analytics & Machine Learning Inference", subtitle_style),
            Paragraph(f"Reference ID: HC-{patient.id}", ParagraphStyle("HeaderRightRef", parent=styles["Normal"], fontSize=8, leading=10, textColor=colors.HexColor("#e2e8f0"), fontName="Helvetica-Bold", alignment=2))
        ]
    ]
    header_table = Table(header_content, colWidths=[5.2 * inch, 2.0 * inch])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#1e1b4b")),
        ("PADDING", (0, 0), (-1, -1), 12),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 1), (-1, 1), 2),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))
    
    # Crimson accent separator
    accent_bar = Table([[""]], colWidths=[7.2 * inch], rowHeights=[3])
    accent_bar.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#e11d48")),
        ("PADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(accent_bar)
    story.append(Spacer(1, 12))

    # 2. Patient Profile Information Card
    story.append(Paragraph("Patient Clinical Records & Metadata", heading_style))
    user = patient.user
    
    info_data = [
        [
            Paragraph("Patient Full Name:", label_style), Paragraph(user.get_full_name() or user.username, val_style),
            Paragraph("System Record ID:", label_style), Paragraph(f"PID-{patient.id}", val_style)
        ],
        [
            Paragraph("Professional Email:", label_style), Paragraph(user.email, val_style),
            Paragraph("Biological Gender:", label_style), Paragraph(user.gender.title() if user.gender else "N/A", val_style)
        ],
        [
            Paragraph("Date of Birth:", label_style), Paragraph(str(user.date_of_birth) if user.date_of_birth else "N/A", val_style),
            Paragraph("Blood Type:", label_style), Paragraph(patient.blood_group or "N/A", val_style)
        ],
        [
            Paragraph("Assigned Cardiologist:", label_style), Paragraph(str(patient.assigned_doctor) if patient.assigned_doctor else "None Assigned", val_style),
            Paragraph("Registered Phone:", label_style), Paragraph(user.phone or "N/A", val_style)
        ]
    ]
    info_table = Table(info_data, colWidths=[1.5 * inch, 2.1 * inch, 1.4 * inch, 2.2 * inch])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cbd5e1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 12))

    # 3. Prediction & Risk Assessment Banner (If available)
    if prediction:
        story.append(Paragraph("Machine Learning Inference Output", heading_style))
        
        # Color codes matching risk level
        risk_labels = {
            "low": ("LOW DIAGNOSTIC RISK", "#15803d", "#dcfce7", "#bbf7d0"),
            "medium": ("MODERATE DIAGNOSTIC RISK", "#b45309", "#fef3c7", "#fde68a"),
            "high": ("HIGH PATHOLOGY INDICATED", "#be123c", "#ffe4e6", "#fecdd3"),
        }
        label, text_color, bg_color, border_color = risk_labels.get(
            prediction.risk_level.lower(),
            ("DIAGNOSTIC DATA RECORDED", "#475569", "#f1f5f9", "#e2e8f0")
        )
        
        banner_content = [
            [
                Paragraph(f"<font color='{text_color}'><b>{label}</b></font>", ParagraphStyle("BannerTitle", parent=styles["Normal"], fontSize=10.5, leading=12, fontName="Helvetica-Bold")),
                Paragraph(f"<font color='{text_color}'><b>PROBABILITY SCORE: {prediction.probability:.1f}%</b></font>", ParagraphStyle("BannerProb", parent=styles["Normal"], fontSize=10.5, leading=12, fontName="Helvetica-Bold", alignment=2))
            ],
            [
                Paragraph(f"<b>Inference Engine:</b> {prediction.algorithm_used.replace('_', ' ').title()} Classifier · <b>Prediction Timestamp:</b> {prediction.created_at.strftime('%B %d, %Y %I:%M %p')}", ParagraphStyle("BannerDesc", parent=styles["Normal"], fontSize=8, leading=11, textColor=colors.HexColor("#475569"))),
                ""
            ]
        ]
        banner_table = Table(banner_content, colWidths=[4.2 * inch, 3.0 * inch])
        banner_table.setStyle(TableStyle([
            ("SPAN", (0, 1), (1, 1)),
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(bg_color)),
            ("BOX", (0, 0), (-1, -1), 1.25, colors.HexColor(border_color)),
            ("PADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
            ("TOPPADDING", (0, 1), (-1, 1), 2),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        story.append(banner_table)
        story.append(Spacer(1, 12))

        # 4. Clinical Vitals Grid
        if prediction.health_record:
            rec = prediction.health_record
            story.append(Paragraph("Patient Clinical Health Vitals & Parameters", heading_style))
            
            health_data = [
                [
                    Paragraph("Patient Age:", label_style), Paragraph(f"{rec.age} Years", val_style),
                    Paragraph("Resting Blood Pressure:", label_style), Paragraph(f"{rec.resting_blood_pressure} mm Hg", val_style)
                ],
                [
                    Paragraph("Serum Cholesterol:", label_style), Paragraph(f"{rec.cholesterol} mg/dl", val_style),
                    Paragraph("Maximum Heart Rate:", label_style), Paragraph(f"{rec.max_heart_rate} bpm", val_style)
                ],
                [
                    Paragraph("Fasting Blood Sugar:", label_style), Paragraph("Elevated (>120 mg/dl)" if rec.fasting_blood_sugar else "Normal (<120 mg/dl)", val_style),
                    Paragraph("Exercise-Induced Angina:", label_style), Paragraph("Indicated" if rec.exercise_induced_angina else "Not Indicated", val_style)
                ],
                [
                    Paragraph("ST Depression Peak:", label_style), Paragraph(f"{rec.st_depression}", val_style),
                    Paragraph("Tobacco Use History:", label_style), Paragraph("Active Smoker" if rec.smoking else "Non-Smoker", val_style)
                ]
            ]
            health_table = Table(health_data, colWidths=[1.7 * inch, 1.9 * inch, 1.8 * inch, 1.8 * inch])
            health_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("PADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]))
            story.append(health_table)
            story.append(Spacer(1, 12))

        # 5. Recommendations
        story.append(Paragraph("System-Generated Clinical Advice & Intervention Protocol", heading_style))
        
        # Recommendation details container
        recs_content = []
        if prediction.alert_message:
            recs_content.append(Paragraph(f"<b>Pathology Warning:</b> {prediction.alert_message}", alert_text_style))
            recs_content.append(Spacer(1, 4))
        
        recs_content.append(Paragraph("<b>Heart-Healthy Dietary Protocol:</b>", ParagraphStyle("RecSubTitle", parent=styles["Normal"], fontSize=9, leading=12, fontName="Helvetica-Bold", textColor=colors.HexColor("#1e1b4b"))))
        for item in prediction.diet_recommendations[:4]:
            recs_content.append(Paragraph(f"• {item}", body_style))
        recs_content.append(Spacer(1, 6))

        recs_content.append(Paragraph("<b>Cardiorespiratory Exercise Guidelines:</b>", ParagraphStyle("RecSubTitle", parent=styles["Normal"], fontSize=9, leading=12, fontName="Helvetica-Bold", textColor=colors.HexColor("#1e1b4b"))))
        for item in prediction.exercise_recommendations[:3]:
            recs_content.append(Paragraph(f"• {item}", body_style))

        if prediction.smoking_advice:
            recs_content.append(Spacer(1, 6))
            recs_content.append(Paragraph(f"<b>Tobacco Cessation Advice:</b> {prediction.smoking_advice}", body_style))

        # Pack recommendations inside a stylish box
        recs_table = Table([[recs_content]], colWidths=[7.2 * inch])
        recs_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cbd5e1")),
            ("PADDING", (0, 0), (-1, -1), 10),
        ]))
        story.append(recs_table)

    # 6. Page / Document Footer
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor("#cbd5e1")))
    story.append(Spacer(1, 4))
    
    footer_text = (
        "<b>Confidential Medical Report</b> | Compiled Dynamically by HeartCare AI Decision-Support Systems. "
        "This report is for clinical screening purposes only and does not replace a definitive medical consultation. "
        "Generates on " + (prediction.created_at if prediction else patient.created_at).strftime('%Y-%m-%d %H:%M') + "."
    )
    story.append(Paragraph(
        footer_text,
        ParagraphStyle("ClinicalFooter", parent=styles["Normal"], fontSize=7, leading=10,
                       textColor=colors.HexColor("#64748b"), alignment=TA_CENTER),
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
            prediction = None
            if prediction_id:
                try:
                    prediction = Prediction.objects.get(id=prediction_id)
                    profile = prediction.patient
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

        pdf_bytes = generate_patient_report_pdf(profile, prediction)

        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        filename = f"heartcare_report_{profile.user.username}.pdf"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response


def generate_prescription_pdf(prescription) -> bytes:
    """Generate a professional prescription PDF."""
    from doctors.models import Prescription as Rx
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "RxTitle", parent=styles["Normal"],
        fontSize=18, leading=22, textColor=colors.white, fontName="Helvetica-Bold"
    )
    subtitle_style = ParagraphStyle(
        "RxSubtitle", parent=styles["Normal"],
        fontSize=9, leading=13, textColor=colors.HexColor("#94a3b8"), fontName="Helvetica"
    )
    heading_style = ParagraphStyle(
        "RxHeading", parent=styles["Heading2"],
        fontSize=11, leading=15, textColor=colors.HexColor("#1e1b4b"),
        spaceBefore=12, spaceAfter=5, fontName="Helvetica-Bold"
    )
    label_style = ParagraphStyle(
        "RxLabel", parent=styles["Normal"],
        fontSize=9, leading=12, textColor=colors.HexColor("#475569"), fontName="Helvetica-Bold"
    )
    val_style = ParagraphStyle(
        "RxVal", parent=styles["Normal"],
        fontSize=9, leading=12, textColor=colors.HexColor("#0f172a"), fontName="Helvetica"
    )
    body_style = ParagraphStyle(
        "RxBody", parent=styles["Normal"],
        fontSize=9.5, leading=14, textColor=colors.HexColor("#1e293b")
    )

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    header_data = [
        [
            Paragraph("HEARTCARE AI — CLINICAL PRESCRIPTION", title_style),
            Paragraph("Official Medical Rx Document", ParagraphStyle("HR", parent=styles["Normal"], fontSize=8, leading=10, textColor=colors.HexColor("#94a3b8"), alignment=2))
        ],
        [
            Paragraph(f"Issued by: Dr. {prescription.doctor} · {prescription.doctor.specialization.replace('_', ' ').title()}", subtitle_style),
            Paragraph(f"Rx ID: #{prescription.id}", ParagraphStyle("HRRef", parent=styles["Normal"], fontSize=8, leading=10, textColor=colors.HexColor("#e2e8f0"), fontName="Helvetica-Bold", alignment=2))
        ]
    ]
    header_table = Table(header_data, colWidths=[5.2 * inch, 2.0 * inch])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#1e1b4b")),
        ("PADDING", (0, 0), (-1, -1), 12),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 1), (-1, 1), 2),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 3))

    accent = Table([[""]], colWidths=[7.2 * inch], rowHeights=[3])
    accent.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#7c3aed")),
        ("PADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(accent)
    story.append(Spacer(1, 12))

    # ── Doctor & Patient Info ─────────────────────────────────────────────────
    story.append(Paragraph("Clinical Parties", heading_style))
    doc_user = prescription.doctor.user
    pat_user = prescription.patient.user

    info_data = [
        [
            Paragraph("Prescribing Doctor:", label_style),
            Paragraph(f"Dr. {doc_user.get_full_name() or doc_user.username}", val_style),
            Paragraph("Patient Name:", label_style),
            Paragraph(pat_user.get_full_name() or pat_user.username, val_style),
        ],
        [
            Paragraph("Specialization:", label_style),
            Paragraph(prescription.doctor.specialization.replace("_", " ").title(), val_style),
            Paragraph("Patient Email:", label_style),
            Paragraph(pat_user.email, val_style),
        ],
        [
            Paragraph("Hospital:", label_style),
            Paragraph(prescription.doctor.hospital_name or "HeartCare Medical Centre", val_style),
            Paragraph("Date Issued:", label_style),
            Paragraph(prescription.created_at.strftime("%B %d, %Y"), val_style),
        ],
    ]
    info_table = Table(info_data, colWidths=[1.4 * inch, 2.2 * inch, 1.3 * inch, 2.3 * inch])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cbd5e1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 12))

    # ── Diagnosis ─────────────────────────────────────────────────────────────
    story.append(Paragraph("Diagnosis", heading_style))
    diag_table = Table([[Paragraph(prescription.diagnosis, body_style)]], colWidths=[7.2 * inch])
    diag_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#faf5ff")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#c4b5fd")),
        ("PADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(diag_table)
    story.append(Spacer(1, 10))

    # ── Medications ───────────────────────────────────────────────────────────
    story.append(Paragraph("Prescribed Medications", heading_style))
    med_lines = [Paragraph(f"• {line.strip()}", body_style) for line in prescription.medications.split("\n") if line.strip()]
    med_table = Table([med_lines or [Paragraph(prescription.medications, body_style)]], colWidths=[7.2 * inch])
    med_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#86efac")),
        ("PADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(Table([[m] for m in (med_lines or [Paragraph(prescription.medications, body_style)])], colWidths=[7.2 * inch],
                       style=TableStyle([
                           ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
                           ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#86efac")),
                           ("PADDING", (0, 0), (-1, -1), 10),
                       ])))
    story.append(Spacer(1, 10))

    # ── Dosage Instructions ───────────────────────────────────────────────────
    story.append(Paragraph("Dosage & Administration Instructions", heading_style))
    dos_table = Table([[Paragraph(prescription.dosage_instructions, body_style)]], colWidths=[7.2 * inch])
    dos_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fffbeb")),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#fcd34d")),
        ("PADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(dos_table)
    story.append(Spacer(1, 10))

    # ── Recommended Tests ─────────────────────────────────────────────────────
    if prescription.recommended_tests:
        story.append(Paragraph("Recommended Clinical Tests", heading_style))
        tests_table = Table([[Paragraph(prescription.recommended_tests, body_style)]], colWidths=[7.2 * inch])
        tests_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0f9ff")),
            ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#7dd3fc")),
            ("PADDING", (0, 0), (-1, -1), 10),
        ]))
        story.append(tests_table)
        story.append(Spacer(1, 10))

    # ── Follow-Up & Notes ─────────────────────────────────────────────────────
    extra_data = []
    if prescription.follow_up_date:
        extra_data.append([
            Paragraph("Follow-Up Date:", label_style),
            Paragraph(prescription.follow_up_date.strftime("%B %d, %Y"), val_style),
        ])
    if prescription.notes:
        extra_data.append([
            Paragraph("Special Guidelines:", label_style),
            Paragraph(prescription.notes, val_style),
        ])
    if extra_data:
        story.append(Paragraph("Additional Information", heading_style))
        extra_table = Table(extra_data, colWidths=[1.8 * inch, 5.4 * inch])
        extra_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("PADDING", (0, 0), (-1, -1), 8),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(extra_table)
        story.append(Spacer(1, 12))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor("#cbd5e1")))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        f"<b>Confidential Clinical Prescription</b> | Issued by HeartCare AI Healthcare Platform. "
        f"This document is legally signed by Dr. {prescription.doctor} on "
        f"{prescription.created_at.strftime('%Y-%m-%d %H:%M')}. "
        f"For queries, contact your cardiologist directly.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=7, leading=10,
                       textColor=colors.HexColor("#64748b"), alignment=TA_CENTER)
    ))

    doc.build(story)
    return buffer.getvalue()


class DownloadPrescriptionPDFView(APIView):
    """Patient/Doctor: Download prescription as PDF"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, prescription_id):
        from doctors.models import Prescription
        from patients.models import PatientProfile
        user = request.user
        try:
            if user.role == "patient":
                profile, _ = PatientProfile.objects.get_or_create(user=user)
                prescription = Prescription.objects.get(id=prescription_id, patient=profile)
            elif user.role == "doctor":
                from doctors.models import DoctorProfile
                doctor_profile = DoctorProfile.objects.get(user=user)
                prescription = Prescription.objects.get(id=prescription_id, doctor=doctor_profile)
            else:
                prescription = Prescription.objects.get(id=prescription_id)
        except Exception:
            return Response({"error": "Prescription not found."}, status=404)

        pdf_bytes = generate_prescription_pdf(prescription)
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        filename = f"prescription_{prescription.id}_{prescription.patient.user.username}.pdf"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response


class AnalyticsDashboardView(APIView):
    """Admin: Analytics for dashboard"""
    permission_classes = [IsAdminRole]

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
