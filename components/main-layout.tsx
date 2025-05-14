"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebcamView } from "@/components/webcam-view";
import { AnalysisPanel } from "@/components/analysis-panel";
import { StatusWidget } from "@/components/status-widget";
import { AnalysisData } from "@/types/analysis";

export function MainLayout() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalysisData = (data: AnalysisData) => {
    setAnalysisData(data);
  };

  return (
    <main className="flex-grow container py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WebcamView onAnalysisData={handleAnalysisData} />
        </div>
        <div className="space-y-6">
          <StatusWidget analysisData={analysisData} />
        </div>
      </div>
      <div className="mt-6">
        <AnalysisPanel analysisData={analysisData} />
      </div>
    </main>
  );
}