
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

// Traffic data interface for network monitoring
export interface TrafficData {
  id: string;
  sourceIP: string;
  destIP: string;
  protocol: string;
  port: number;
  bytes: number;
  timestamp: string;
  anomalyScore: number;
}

// Anomaly data interface for real-time monitoring
export interface AnomalyData {
  time: string;
  score: number;
}

// Legacy alert interface for backwards compatibility
export interface LegacyAlert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  type: string;
}

// System status interface
export interface SystemStatus {
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  lastCheck: string;
}

// System health interface
export interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
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
