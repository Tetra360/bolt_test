"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AnalysisData } from "@/types/analysis";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { API_URL } from "@/config";

interface WebcamViewProps {
  onAnalysisData: (data: AnalysisData) => void;
}

export function WebcamView({ onAnalysisData }: WebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup stream when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access webcam. Please check permissions.');
      toast({
        variant: "destructive",
        title: "Webcam Error",
        description: "Failed to access webcam. Please check your permissions."
      });
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data as base64 string
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const analyzeFrame = async () => {
    if (!isStreaming) return;
    
    const frameData = captureFrame();
    if (!frameData) return;

    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: frameData.split(',')[1], // Remove data URL prefix
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      onAnalysisData(data);
      
      toast({
        title: "Analysis Complete",
        description: "Perspective analysis data received",
      });
    } catch (err) {
      console.error('Error analyzing frame:', err);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze webcam frame. Check server connection.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">
                  {error || "Webcam not active. Click Start to begin."}
                </p>
              </div>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex justify-center gap-4">
        {!isStreaming ? (
          <Button onClick={startWebcam} className="w-36">
            <Camera className="mr-2 h-4 w-4" />
            Start Webcam
          </Button>
        ) : (
          <Button onClick={stopWebcam} variant="outline" className="w-36">
            <CameraOff className="mr-2 h-4 w-4" />
            Stop Webcam
          </Button>
        )}
        
        <Button 
          onClick={analyzeFrame} 
          disabled={!isStreaming || isAnalyzing}
          className="w-36"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Frame"
          )}
        </Button>
      </div>
    </div>
  );
}