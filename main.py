from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import base64
import jarvis
import tempfile

# FastAPI App
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Change this to specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Helper function to encode an image
def encode_image(file):
    return base64.b64encode(file.read()).decode()


# API endpoint for UI comparison
@app.post("/compare-ui")
async def compare_ui(figma_file: UploadFile = File(...), ui_file: UploadFile = File(...)):
    figma_bytes = await figma_file.read()
    ui_bytes = await ui_file.read()

    report, marked_img_base64 = jarvis.generate_comparison_report(figma_bytes, ui_bytes)

    return {
        "status": "success",
        "report": report,
        "marked_image": marked_img_base64
    }

@app.get('/testapi/')
async def testapi():
    return JSONResponse(status_code=200, content={"message": "Api call success 42"})