from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

def create_learning_path_pdf(data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    heading_style = styles['Heading2']
    normal_style = styles['BodyText']
    
    # Title
    elements.append(Paragraph(f"Learning Path: {data['course_name']}", title_style))
    elements.append(Spacer(1, 12))
    
    # Summary
    summary_text = f"""
    <b>Total Duration:</b> {data['total_days']} Days<br/>
    <b>Daily Intensity:</b> {data['hours_per_day']} Hours/Day<br/>
    <b>Total Effort:</b> {data['total_hours']} Hours
    """
    elements.append(Paragraph(summary_text, normal_style))
    elements.append(Spacer(1, 24))
    
    # Schedule Table
    table_data = [['Day', 'Phase', 'Topic', 'Activity']]
    
    for item in data['schedule']:
        table_data.append([
            f"Day {item['day']}",
            item['phase'],
            item['topic'],
            item['activity']
        ])
        
    # Table Styling
    table = Table(table_data, colWidths=[50, 100, 150, 180])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.indigo),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(table)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

def generate_certificate_pdf(student_name, course_name, date_str, cert_code):
    buffer = BytesIO()
    # Use canvas for more control over absolute positioning which is better for certificates
    c = canvas.Canvas(buffer, pagesize=landscape(letter))
    width, height = landscape(letter)
    
    # Draw Border
    c.setStrokeColor(colors.indigo)
    c.setLineWidth(5)
    c.rect(0.5*inch, 0.5*inch, width-1*inch, height-1*inch)
    
    c.setStrokeColor(colors.gold)
    c.setLineWidth(2)
    c.rect(0.6*inch, 0.6*inch, width-1.2*inch, height-1.2*inch)
    
    # Content
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width/2, height - 2*inch, "Certificate of Completion")
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 2.5*inch, "This is to certify that")
    
    c.setFont("Helvetica-Bold", 30)
    c.setFillColor(colors.indigo)
    c.drawCentredString(width/2, height - 3.5*inch, student_name)
    
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 4.2*inch, "has successfully completed the course")
    
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height - 5*inch, course_name)
    
    # Footer/Signatures
    c.setFont("Helvetica", 12)
    c.drawString(2*inch, 2*inch, f"Date: {date_str}")
    c.drawString(width - 4*inch, 2*inch, "LMS Instuctor")
    c.line(width - 4*inch, 2.2*inch, width - 2*inch, 2.2*inch)
    
    # Logo / Verification
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.gray)
    c.drawCentredString(width/2, 1*inch, f"Verification Code: {cert_code}")
    c.drawCentredString(width/2, 0.8*inch, "LMS Platform")

    c.save()
    buffer.seek(0)
    return buffer
