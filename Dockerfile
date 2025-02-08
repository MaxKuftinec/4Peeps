FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (including Tesseract for pytesseract)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt  

# Copy project files
COPY . .  

# Expose the port (Cloud Run uses 8080)
EXPOSE 8080

# Run FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
