
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

// Legacy alert format from older data
export interface LegacyAlert {
  id: number;
  type: string;
  severity: string;
  timestamp: string;
  source: string;
  destination: string;
  description: string;
}

// Network traffic data
export interface TrafficData {
  id: string;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  protocol: string;
  port: number;
  bytes: number;
  anomalyScore: number;
}

// Anomaly data for charts
export interface AnomalyData {
  time: string;
  score: number;
}

// System status information
export interface SystemStatus {
  activeThreats: number;
  systemsMonitored: number;
  alertsToday: number;
  criticalAlerts: number;
}

// System health information
export interface SystemHealth {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  load: number;
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
