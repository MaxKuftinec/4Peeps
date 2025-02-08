from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import base64
import os

# Load the API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=GEMINI_API_KEY)

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
@app.post("/compare-ui/")
async def compare_ui(
    figma_url: str = Form(None), 
    figma_screenshot: UploadFile = File(None),
    website_url: str = Form(None),
    website_screenshot: UploadFile = File(None)
):
    try:
        # Validate input: Ensure either URL or file is provided
        if not any([figma_url, figma_screenshot, website_url, website_screenshot]):
            return JSONResponse(status_code=400, content={"error": "Provide either a URL or an image file."})

        # Encode Figma Image (if file is provided)
        figma_base64 = encode_image(figma_screenshot.file) if figma_screenshot else None

        # Encode Website Screenshot (if file is provided)
        website_base64 = encode_image(website_screenshot.file) if website_screenshot else None

        # Create AI Prompt
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "You are a helpful assistant that can explain this UI screenshot. We will use your output to compare it with the corresponding Figma design."),
                (
                    "human",
                    [
                        {"type": "text", "text": "Explain the image"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{figma_base64 or website_base64}",
                                "detail": "low",
                            },
                        },
                    ],
                ),
            ]
        )

        # Invoke the AI model
        chain = prompt | llm
        ai_response = chain.invoke({"input": "Analyze this UI design."})

        return JSONResponse(
            status_code=200,
            content={
                "message": "UI Analysis Completed",
                "analysis": ai_response.content,
            },
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get('/testapi/')
async def testapi():
    return JSONResponse(status_code=200, content={"message": "Api call success"})