import cv2
import numpy as np
import pytesseract
import json
import io
from skimage.metrics import structural_similarity as ssim
from PIL import Image

# Set path for Tesseract OCR (Windows users may need to update this)
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
    """Detects elements that exist in the Figma design but are missing in the UI."""
    orb = cv2.ORB_create()
    
    # Convert images to grayscale
    figma_gray = cv2.cvtColor(figma_img, cv2.COLOR_BGR2GRAY)
    ui_gray = cv2.cvtColor(ui_img, cv2.COLOR_BGR2GRAY)

    # Detect keypoints and descriptors
    keypoints1, descriptors1 = orb.detectAndCompute(figma_gray, None)
    keypoints2, descriptors2 = orb.detectAndCompute(ui_gray, None)

    if descriptors1 is None or descriptors2 is None:
        return ["No key features detected. Ensure clear UI elements."]

    # Use brute-force matcher to find matches
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(descriptors1, descriptors2)

    # Define a threshold for matching
    missing_elements = []
    if len(matches) < len(keypoints1) * 0.6:  # If less than 60% elements are matched
        missing_elements.append("Some UI elements are missing from the developed UI.")

    return missing_elements

def check_alignment(figma_img, ui_img):
    """Checks for alignment issues using SSIM."""
    figma_gray = cv2.cvtColor(figma_img, cv2.COLOR_BGR2GRAY)
    ui_gray = cv2.cvtColor(ui_img, cv2.COLOR_BGR2GRAY)

    score, diff = ssim(figma_gray, ui_gray, full=True)

    if score < 0.9:
        return {"issue": "Misalignment detected", "similarity_score": round(score, 2)}
    return None

def detect_color_difference(figma_img, ui_img):
    """Compares color differences in both images."""
    figma_mean_color = cv2.mean(figma_img)[:3]
    ui_mean_color = cv2.mean(ui_img)[:3]

    color_diff = np.linalg.norm(np.array(figma_mean_color) - np.array(ui_mean_color))

    if color_diff > 20:  # If color difference is significant
        return {"issue": "Color mismatch detected", "difference": round(color_diff, 2)}

    return None

def extract_text(img):
    """Extracts text from an image using OCR."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return pytesseract.image_to_string(gray)

def compare_text(figma_img, ui_img):
    """Compares extracted text between the Figma design and the actual UI."""
    figma_text = extract_text(figma_img).strip()
    ui_text = extract_text(ui_img).strip()

    if figma_text != ui_text:
        return {"issue": "Text mismatch detected", "expected": figma_text, "actual": ui_text}
    
    return None

def generate_comparison_report(figma_bytes, ui_bytes):
    """Runs all checks and returns a structured JSON report."""
    figma_img, ui_img = load_images(figma_bytes, ui_bytes)

    report = {
        "differences": []
    }

    # Detect missing elements
    missing_elements = detect_missing_elements(figma_img, ui_img)
    if missing_elements:
        for element in missing_elements:
            report["differences"].append({"element": "UI Component", "issue": element})

    # Check alignment issues
    alignment_issue = check_alignment(figma_img, ui_img)
    if alignment_issue:
        report["differences"].append(alignment_issue)

    # Check color differences
    color_issue = detect_color_difference(figma_img, ui_img)
    if color_issue:
        report["differences"].append(color_issue)

    # Check text differences
    text_issue = compare_text(figma_img, ui_img)
    if text_issue:
        report["differences"].append(text_issue)

    return json.dumps(report, indent=4)
