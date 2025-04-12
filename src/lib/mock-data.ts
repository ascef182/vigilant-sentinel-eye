
// Mock data for the cybersecurity threat detector

// System stats
export const systemStats = {
  activeThreats: 7,
  systemsMonitored: 142,
  alertsToday: 24,
  criticalAlerts: 3,
};

// Anomaly data for chart
export const anomalyData = [
  { time: '00:00', score: 12 },
  { time: '01:00', score: 15 },
  { time: '02:00', score: 18 },
  { time: '03:00', score: 14 },
  { time: '04:00', score: 10 },
  { time: '05:00', score: 8 },
  { time: '06:00', score: 12 },
  { time: '07:00', score: 20 },
  { time: '08:00', score: 25 },
  { time: '09:00', score: 45 },
  { time: '10:00', score: 78 },
  { time: '11:00', score: 42 },
  { time: '12:00', score: 30 },
  { time: '13:00', score: 22 },
  { time: '14:00', score: 18 },
  { time: '15:00', score: 15 },
  { time: '16:00', score: 20 },
  { time: '17:00', score: 28 },
  { time: '18:00', score: 32 },
  { time: '19:00', score: 30 },
  { time: '20:00', score: 25 },
  { time: '21:00', score: 28 },
  { time: '22:00', score: 32 },
  { time: '23:00', score: 38 },
];

// Alert feed data
export const alertFeedData = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    type: 'Brute Force Attack',
    source: '192.168.1.105',
    destination: '10.0.0.15',
    severity: 'critical',
    description: 'Multiple failed login attempts detected',
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(), // 12 minutes ago
    type: 'Port Scanning',
    source: '45.134.26.178',
    destination: '10.0.0.1',
    severity: 'warning',
    description: 'Sequential port scanning detected from external IP',
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    type: 'Data Exfiltration',
    source: '10.0.0.42',
    destination: '103.245.89.112',
    severity: 'critical',
    description: 'Unusual outbound data transfer to unrecognized domain',
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 38 * 60000).toISOString(), // 38 minutes ago
    type: 'Malware Detection',
    source: 'Email Attachment',
    destination: '10.0.0.78',
    severity: 'critical',
    description: 'Potential trojan detected in email attachment',
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 67 * 60000).toISOString(), // 67 minutes ago
    type: 'Suspicious Process',
    source: 'Internal System',
    destination: '10.0.0.23',
    severity: 'warning',
    description: 'Unusual process spawned with elevated privileges',
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 95 * 60000).toISOString(), // 95 minutes ago
    type: 'API Abuse',
    source: '172.16.8.112',
    destination: 'API Gateway',
    severity: 'warning',
    description: 'Excessive API calls detected from internal system',
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    type: 'Phishing Attempt',
    source: 'Email Gateway',
    destination: 'Multiple Recipients',
    severity: 'info',
    description: 'Potential phishing email blocked by email security',
  },
];

// System health data
export const systemHealthData = [
  { name: 'Firewall', status: 'operational', load: 65 },
  { name: 'IDS/IPS', status: 'operational', load: 72 },
  { name: 'SIEM', status: 'operational', load: 83 },
  { name: 'Email Security', status: 'operational', load: 58 },
  { name: 'Endpoint Protection', status: 'degraded', load: 92 },
  { name: 'Network Monitoring', status: 'operational', load: 75 },
];

// Threat map data (source countries for attacks)
export const threatMapData = [
  { id: 'US', value: 135 },
  { id: 'CN', value: 284 },
  { id: 'RU', value: 216 },
  { id: 'KP', value: 97 },
  { id: 'IR', value: 148 },
  { id: 'BR', value: 62 },
  { id: 'IN', value: 78 },
  { id: 'UA', value: 104 },
  { id: 'GB', value: 45 },
  { id: 'FR', value: 38 },
  { id: 'DE', value: 52 },
];

// Traffic data table
export const trafficData = [
  {
    id: 1,
    timestamp: '2023-04-12T09:42:15',
    sourceIP: '192.168.1.105',
    destIP: '10.0.0.15',
    protocol: 'TCP',
    port: 22,
    bytes: 2456,
    packets: 18,
    flags: 'SYN, ACK',
    anomalyScore: 0.87,
  },
  {
    id: 2,
    timestamp: '2023-04-12T09:42:18',
    sourceIP: '45.134.26.178',
    destIP: '10.0.0.1',
    protocol: 'UDP',
    port: 53,
    bytes: 876,
    packets: 4,
    flags: 'N/A',
    anomalyScore: 0.32,
  },
  {
    id: 3,
    timestamp: '2023-04-12T09:42:22',
    sourceIP: '10.0.0.42',
    destIP: '103.245.89.112',
    protocol: 'TCP',
    port: 443,
    bytes: 15782,
    packets: 24,
    flags: 'PSH, ACK',
    anomalyScore: 0.91,
  },
  {
    id: 4,
    timestamp: '2023-04-12T09:42:25',
    sourceIP: '10.0.0.78',
    destIP: '172.217.167.142',
    protocol: 'TCP',
    port: 443,
    bytes: 3254,
    packets: 12,
    flags: 'PSH, ACK',
    anomalyScore: 0.12,
  },
  {
    id: 5,
    timestamp: '2023-04-12T09:42:30',
    sourceIP: '172.16.8.112',
    destIP: '10.0.0.1',
    protocol: 'TCP',
    port: 8080,
    bytes: 1876,
    packets: 8,
    flags: 'PSH, ACK',
    anomalyScore: 0.45,
  },
  {
    id: 6,
    timestamp: '2023-04-12T09:42:33',
    sourceIP: '10.0.0.15',
    destIP: '8.8.8.8',
    protocol: 'UDP',
    port: 53,
    bytes: 648,
    packets: 2,
    flags: 'N/A',
    anomalyScore: 0.07,
  },
];

// Filter options
export const filterOptions = {
  severity: ['All', 'Critical', 'Warning', 'Info'],
  timeRange: ['Last Hour', 'Last 6 Hours', 'Last 24 Hours', 'Last 7 Days'],
  systemTypes: ['All Systems', 'Network Devices', 'Servers', 'Endpoints', 'Cloud Resources'],
};
