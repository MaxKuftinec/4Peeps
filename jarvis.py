import cv2
import numpy as np
import pytesseract
import json
import io
import base64
from skimage.metrics import structural_similarity as ssim
from PIL import Image

# Set path for Tesseract OCR
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

def load_images(figma_bytes, ui_bytes):
    figma_img = np.array(Image.open(io.BytesIO(figma_bytes)))
    ui_img = np.array(Image.open(io.BytesIO(ui_bytes)))
    figma_img = cv2.cvtColor(figma_img, cv2.COLOR_RGB2BGR)
    ui_img = cv2.cvtColor(ui_img, cv2.COLOR_RGB2BGR)
    figma_img = cv2.resize(figma_img, (ui_img.shape[1], ui_img.shape[0]))
    return figma_img, ui_img

def detect_missing_elements(figma_img, ui_img):
    orb = cv2.ORB_create()
    figma_gray = cv2.cvtColor(figma_img, cv2.COLOR_BGR2GRAY)
    ui_gray = cv2.cvtColor(ui_img, cv2.COLOR_BGR2GRAY)
    keypoints1, descriptors1 = orb.detectAndCompute(figma_gray, None)
    keypoints2, descriptors2 = orb.detectAndCompute(ui_gray, None)

    if descriptors1 is None or descriptors2 is None:
        return []

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(descriptors1, descriptors2)

    missing_elements = []
    if len(matches) < len(keypoints1) * 0.6:
        missing_elements.append("Some UI elements are missing from the developed UI.")
    return missing_elements

def check_alignment(figma_img, ui_img):
    figma_gray = cv2.cvtColor(figma_img, cv2.COLOR_BGR2GRAY)
    ui_gray = cv2.cvtColor(ui_img, cv2.COLOR_BGR2GRAY)
    score, diff = ssim(figma_gray, ui_gray, full=True)
    diff = (diff * 255).astype("uint8")
    thresh = cv2.threshold(diff, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    return {"score": score, "contours": contours}

def detect_color_difference(figma_img, ui_img):
    figma_mean_color = cv2.mean(figma_img)[:3]
    ui_mean_color = cv2.mean(ui_img)[:3]
    color_diff = np.linalg.norm(np.array(figma_mean_color) - np.array(ui_mean_color))
    return color_diff

def extract_text(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return pytesseract.image_to_string(gray)

def compare_text(figma_img, ui_img):
    figma_text = extract_text(figma_img).strip()
    ui_text = extract_text(ui_img).strip()
    return figma_text, ui_text

def draw_markers(figma_img, ui_img, alignment_contours, text_mismatch_positions):
    """Draws markers on the UI image to highlight discrepancies."""
    marked_img = ui_img.copy()

    # Draw alignment discrepancies
    for contour in alignment_contours:
        x, y, w, h = cv2.boundingRect(contour)
        cv2.rectangle(marked_img, (x, y), (x + w, y + h), (0, 0, 255), 2)

    return marked_img

def generate_comparison_report(figma_bytes, ui_bytes):
    """Runs all checks and returns a structured JSON report and marked-up image."""
    figma_img, ui_img = load_images(figma_bytes, ui_bytes)

    report = {"differences": []}

    missing_elements = detect_missing_elements(figma_img, ui_img)
    report["differences"].extend(missing_elements)

    # Check alignment issues
    alignment_result = check_alignment(figma_img, ui_img)
    if alignment_result["score"] < 0.9:
        report["differences"].append({"issue": "Misalignment detected", "similarity_score": round(alignment_result["score"], 2)})
    else: 
        report["differences"].append({"issue": "Misalignment detected", "similarity_score": round(alignment_result["score"], 2)})
        
    # Check color differences
    color_diff = detect_color_difference(figma_img, ui_img)
    if color_diff > 20:
        report["differences"].append({"issue": "Color mismatch detected", "difference": round(color_diff, 2)})

    # Check text differences
    figma_text, ui_text = compare_text(figma_img, ui_img)
    if figma_text != ui_text:
        report["differences"].append({"issue": "Text mismatch detected", "expected": figma_text, "actual": ui_text})

    # Draw markers on the UI image
    text_mismatch_positions = [(10, 30)]  # Example positions for text mismatches
    marked_img = draw_markers(figma_img, ui_img, alignment_result["contours"], text_mismatch_positions)

    # Convert marked image to base64
    _, buffer = cv2.imencode(".png", marked_img)
    marked_img_base64 = base64.b64encode(buffer).decode("utf-8")

    return json.dumps(report, indent=4), marked_img_base64
