import cv2
import numpy as np
import pytesseract
import json
import io
from skimage.metrics import structural_similarity as ssim
from PIL import Image

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

    missing_count = len(keypoints1) - len(matches)
    if missing_count > 0:
        return [{
            "element": "UI Component",
            "issue": "Some UI elements are missing from the developed UI.",
            "description": f"Approximately {missing_count} key elements are missing from the UI compared to the Figma design. This may affect functionality and user experience."
        }]
    return []

def check_alignment(figma_img, ui_img):
    figma_gray = cv2.cvtColor(figma_img, cv2.COLOR_BGR2GRAY)
    ui_gray = cv2.cvtColor(ui_img, cv2.COLOR_BGR2GRAY)

    score, _ = ssim(figma_gray, ui_gray, full=True)
    
    similarity_percentage = round(score * 100, 2)
    

    if score < 0.9:
        severity = "severe" if score < 0.5 else "moderate"
        return {
            "issue": "Misalignment detected",
            "similarity_score": round(score, 2),
            "description": f"The UI alignment differs significantly from the Figma design. The similarity score is {similarity_percentage}%, indicating a {severity} alignment issue."
        }
    return None

def detect_color_difference(figma_img, ui_img):
    figma_mean_color = cv2.mean(figma_img)[:3]
    ui_mean_color = cv2.mean(ui_img)[:3]

    color_diff = np.linalg.norm(np.array(figma_mean_color) - np.array(ui_mean_color))

    if color_diff > 20:
        severity = "major" if color_diff > 50 else "noticeable"
        return {
            "issue": "Color mismatch detected",
            "difference": round(color_diff, 2),
            "description": f"There is a {severity} color difference between the Figma design and the UI. The difference value is {round(color_diff, 2)}, which may affect design consistency."
        }

    return None

def extract_text(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return pytesseract.image_to_string(gray)

def compare_text(figma_img, ui_img):
    figma_text = extract_text(figma_img).strip()
    ui_text = extract_text(ui_img).strip()

    if figma_text != ui_text:
        return {
            "issue": "Text mismatch detected",
            "expected": figma_text,
            "actual": ui_text,
            "description": f"The text in the UI does not match the Figma design. Expected: '{figma_text}', but found: '{ui_text}'."
        }
    
    return None

def generate_comparison_report(figma_bytes, ui_bytes):
    figma_img, ui_img = load_images(figma_bytes, ui_bytes)

    report = {"differences": []}

    missing_elements = detect_missing_elements(figma_img, ui_img)
    report["differences"].extend(missing_elements)

    alignment_issue = check_alignment(figma_img, ui_img)
    if alignment_issue:
        report["differences"].append(alignment_issue)

    color_issue = detect_color_difference(figma_img, ui_img)
    if color_issue:
        report["differences"].append(color_issue)

    text_issue = compare_text(figma_img, ui_img)
    if text_issue:
        report["differences"].append(text_issue)

    return json.dumps(report, indent=4)