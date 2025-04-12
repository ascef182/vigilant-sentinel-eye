
// Tipos de dados para API

export interface ThreatAlert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  source_ip: string;
  destination?: string;
  description: string;
}

export interface SystemStatus {
  activeThreats: number;
  systemsMonitored: number;
  alertsToday: number;
  criticalAlerts: number;
}

export interface AnomalyData {
  time: string;
  score: number;
}

export interface TrafficData {
  id: number;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  protocol: string;
  port: number;
  bytes: number;
  packets?: number;
  flags?: string;
  anomalyScore: number;
}

export interface SystemHealth {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  load: number;
}
