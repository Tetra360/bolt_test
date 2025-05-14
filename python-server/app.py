from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import time
from flask_cors import CORS
import random
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

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

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

@app.route('/analyze', methods=['POST'])
def analyze_frame():
    if not request.json or 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Extract the base64 image data
        image_data = request.json['image']
        
        # Analyze the image
        result = analyzer.analyze_image(image_data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)