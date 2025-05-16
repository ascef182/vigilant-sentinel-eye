// ThreatAlert interface
export interface ThreatAlert {
  id: string;
  type: string;
  severity: string;
  source_ip?: string;
  destination?: string;
  description: string;
  timestamp: string;
}

// Interfaces for API responses
export interface LogAnalysisResult {
  threatDetected: boolean;
  anomalyScore: number;
  suspiciousEntries?: string[];
}

export interface AlertAnalysisResult {
  classification: string;
  score: number;
}
