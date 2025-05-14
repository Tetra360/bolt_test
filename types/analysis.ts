export interface PerspectiveData {
  attention: number;   // 0-100 value indicating attention level
  focus: number;       // 0-100 value indicating focus level
  engagement: number;  // 0-100 value indicating engagement level
  direction: number;   // 0-100 value indicating gaze direction accuracy
}

export interface AnalysisData {
  perspective: PerspectiveData;
  personsDetected: number;
  confidence: number;    // 0-100 confidence score
  processingTime: number; // milliseconds
  timestamp: string;     // ISO timestamp
  summary: string;       // Text summary of analysis
}