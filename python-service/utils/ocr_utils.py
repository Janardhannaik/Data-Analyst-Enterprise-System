

import cv2
import pytesseract
from PIL import Image
import numpy as np
import os

# For PDFs
from pdf2image import convert_from_path

# ---------- Existing OCR for images ----------
def analyze_image_file(file_path):
    """
    Preprocess and extract text from an image file using OpenCV + Tesseract.
    """
    try:
        img = cv2.imread(file_path)
        if img is None:
            return {"error": f"Failed to read image: {file_path}"}

        # Preprocess
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.medianBlur(gray, 3)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # OCR
        text = pytesseract.image_to_string(thresh)
        return {"text": text.strip()}
    except Exception as e:
        return {"error": f"OCR failed: {str(e)}"}


# ---------- PDF extraction ----------
def extract_text_from_pdf(pdf_path):
    """
    Convert PDF pages to images and run OCR on each page.
    Requires poppler installed (for pdf2image).
    """
    try:
        pages = convert_from_path(pdf_path, dpi=300)
        all_text = []

        for page_num, page in enumerate(pages):
            img = np.array(page)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            text = pytesseract.image_to_string(thresh)
            all_text.append(text.strip())

        return {"text": "\n".join(all_text)}
    except Exception as e:
        return {"error": f"PDF OCR failed: {str(e)}"}


