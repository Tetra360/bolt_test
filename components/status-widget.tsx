"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerStatusIndicator } from "@/components/server-status-indicator";
import { AnalysisData } from "@/types/analysis";
import { Brain, Clock, Users } from "lucide-react";

interface StatusWidgetProps {
  analysisData: AnalysisData | null;
}

export function StatusWidget({ analysisData }: StatusWidgetProps) {
  return (
    <div className="space-y-6">
      <ServerStatusIndicator />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Analysis Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Persons:</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.personsDetected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.confidence.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Processing:</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.processingTime.toFixed(0)}ms</span>
                </div>
                <div className="mt-4 pt-3 border-t">
                  <p className="text-sm text-muted-foreground">{analysisData.summary}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No analysis data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}