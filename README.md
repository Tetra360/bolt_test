# Webcam Vision Analysis Application

This application provides real-time human perspective analysis through webcam footage using Python for machine learning and Next.js for the frontend interface.

## Overview

The application consists of two main components:
1. **Next.js Frontend**: Provides the user interface, webcam integration, and analysis results display
2. **Python Backend**: Handles the computer vision processing and analysis

## Features

- Real-time webcam integration
- Computer vision analysis for human perspective detection
- Connection status monitoring
- Analysis results visualization
- Docker Compose setup for easy deployment

## Running the Application

### Prerequisites

- Docker and Docker Compose installed
- Webcam access

### Starting the Application

```bash
# Clone the repository
git clone <repository-url>
cd webcam-vision-analysis

# Start the application with Docker Compose
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development

### Frontend (Next.js)

The frontend is built with:
- Next.js
- TailwindCSS
- ShadCN UI components
- Recharts for data visualization

Key components:
- `WebcamView`: Handles webcam integration and frame capture
- `AnalysisPanel`: Displays analysis results
- `ServerStatusIndicator`: Shows backend connection status

### Backend (Python)

The Python backend uses:
- Flask for the web server
- OpenCV for computer vision
- Flask-CORS for cross-origin requests

In a production environment, you would replace the mock analysis with actual ML models for gaze estimation, attention analysis, etc.

## Environment Variables

- `NEXT_PUBLIC_ML_API_URL`: URL for the backend API (defaults to http://localhost:5000)

## Docker Configuration

- `Dockerfile.frontend`: Builds the Next.js application
- `Dockerfile.backend`: Builds the Python backend
- `docker-compose.yml`: Orchestrates both containers

## License

[MIT License](LICENSE)