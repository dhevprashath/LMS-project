
from utils.pdf_generator import generate_certificate_pdf
import io

try:
    print("Generating PDF...")
    buffer = generate_certificate_pdf("Test User", "Test Course", "2026-01-09", "TEST-CODE")
    if isinstance(buffer, io.BytesIO) and buffer.getbuffer().nbytes > 0:
        print("Success: PDF generated.")
    else:
        print("Failure: Empty buffer.")
except Exception as e:
    print(f"Error: {e}")
