from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import base64
import os

# Load the Gemini API key and set it to the model
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=GEMINI_API_KEY)

# Create a function to encode an input image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode()

image = encode_image("Screenshot 2025-02-08 120259.png")

# Create a chat prompt template to specify the image analytic role for LLM
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant that can explain this UI screenshot. We will use your output to compare with the other output of analyzation of the corresponding figma design and based on the 2 results we will input it to another AI to summarize(e.g point out discrepancies etc)"),
        (
            "human",
            [
                {"type": "text", "text": "{input}"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image}",
                        "detail": "low",
                    },
                },
            ],
        ),
    ]
)

# Invoke the LLM to describe the image details
chain = prompt | llm

res = chain.invoke({"input": "Explain the image"})
print(res.content)