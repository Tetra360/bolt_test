"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerspectiveChart } from "@/components/perspective-chart";
import { AnalysisData } from "@/types/analysis";
import { EyeIcon, Users, Brain } from "lucide-react";

interface AnalysisPanelProps {
  analysisData: AnalysisData | null;
}

export function AnalysisPanel({ analysisData }: AnalysisPanelProps) {
  if (!analysisData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <EyeIcon className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No Analysis Data</h3>
        <p className="text-muted-foreground max-w-md">
          Capture and analyze a webcam frame to see perspective analysis results here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Perspective Analysis
          </CardTitle>
          <CardDescription>
            Analysis of human perspective from webcam frame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PerspectiveChart data={analysisData.perspective} />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detection Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Persons Detected:</span>
                <span className="font-medium">{analysisData.personsDetected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{analysisData.confidence.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time:</span>
                <span className="font-medium">{analysisData.processingTime.toFixed(2)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">{new Date(analysisData.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{analysisData.summary}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}