from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import base64
import time
from datetime import datetime
from typing import List, Optional

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image: str

class FaceBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class FaceDetectionResponse(BaseModel):
    image: str
    faces: List[FaceBox]
    count: int
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str

# This would be replaced with actual ML models in production
class MockPerspectiveAnalyzer:
    def analyze_image(self, image):
        # In a real implementation, this would use actual ML models
        # For this demo, we'll generate mock data

        # Convert base64 to image
        img_data = base64.b64decode(image)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Simulate processing time
        start_time = time.time()

        # Detect faces (simple Haar cascade for demo)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        # Generate analysis results
        num_persons = len(faces)

        if num_persons > 0:
            # Generate perspective metrics
            # In reality, these would come from sophisticated gaze, attention, and pose estimation models
            attention = random.uniform(60, 95) if num_persons > 0 else random.uniform(20, 40)
            focus = random.uniform(65, 98) if num_persons > 0 else random.uniform(10, 30)
            engagement = random.uniform(70, 90) if num_persons > 0 else random.uniform(5, 25)
            direction = random.uniform(75, 95) if num_persons > 0 else random.uniform(0, 20)

            # Generate summary based on metrics
            avg_score = (attention + focus + engagement + direction) / 4

            if avg_score > 80:
                summary = "High level of attention and engagement detected. Subject is fully focused."
            elif avg_score > 60:
                summary = "Moderate attention levels detected. Subject appears engaged but with occasional distractions."
            else:
                summary = "Low attention detected. Subject appears distracted or disinterested."

            confidence = random.uniform(75, 95)
        else:
            # No faces detected
            attention = random.uniform(0, 20)
            focus = random.uniform(0, 15)
            engagement = random.uniform(0, 25)
            direction = random.uniform(0, 10)
            summary = "No faces detected in the frame."
            confidence = random.uniform(90, 99)  # Confident that no one is there

        processing_time = (time.time() - start_time) * 1000  # Convert to ms

        return {
            "perspective": {
                "attention": attention,
                "focus": focus,
                "engagement": engagement,
                "direction": direction
            },
            "personsDetected": num_persons,
            "confidence": confidence,
            "processingTime": processing_time,
            "timestamp": datetime.now().isoformat(),
            "summary": summary
        }

# Initialize the analyzer
analyzer = MockPerspectiveAnalyzer()

class FaceDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        print("Face detector initialized with cascade classifier")

    def detect_faces(self, image: str) -> FaceDetectionResponse:
        try:
            # Convert base64 to image
            img_data = base64.b64decode(image)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                print("Error: Failed to decode image")
                return FaceDetectionResponse(
                    image="",
                    faces=[],
                    count=0,
                    error="Failed to decode image"
                )

            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )

            print(f"Detected {len(faces)} faces")

            # Draw rectangles around faces
            for (x, y, w, h) in faces:
                cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

            # Convert image to base64 for display
            _, buffer = cv2.imencode('.jpg', img)
            img_base64 = base64.b64encode(buffer).decode('utf-8')

            # Convert faces to list of dictionaries
            face_boxes = [
                FaceBox(x=int(x), y=int(y), width=int(w), height=int(h))
                for (x, y, w, h) in faces
            ]

            return FaceDetectionResponse(
                image=img_base64,
                faces=face_boxes,
                count=len(faces)
            )
        except Exception as e:
            print(f"Error in face detection: {str(e)}")
            return FaceDetectionResponse(
                image="",
                faces=[],
                count=0,
                error=str(e)
            )

# Initialize the face detector
detector = FaceDetector()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        timestamp=datetime.now().isoformat()
    )

@app.post("/detect", response_model=FaceDetectionResponse)
async def detect_faces(request: ImageRequest):
    try:
        print("Received image data for face detection")
        result = detector.detect_faces(request.image)
        print(f"Face detection result: {result}")
        return result
    except Exception as e:
        print(f"Error in /detect endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5001)