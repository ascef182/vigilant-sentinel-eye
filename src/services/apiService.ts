import axios from 'axios';
import { ThreatAlert, SystemStatus, AnomalyData, TrafficData, SystemHealth, LegacyAlert } from '@/types/api';
import { supabase } from './supabaseClient';
import { 
  alertFeedData, 
  anomalyData, 
  systemStats, 
  trafficData, 
  systemHealthData 
} from '@/lib/mock-data';

// Flag to control if we use mock data or real API
// Set to true to connect to Supabase API, false to use mock data
const USE_REAL_API = true;

// Axios instance configured (for future HTTP requests if needed)
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// This class simulates an API service that can be later 
// replaced with real backend calls
class ApiService {
  // Stores realtime subscription callbacks
  private realtimeSubscriptions: { [key: string]: () => void } = {};

  // Simulates network delay
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Subscribes to realtime changes for a given table
  subscribeToTable(table: string, callback: (payload: any) => void): () => void {
    if (!USE_REAL_API) {
      console.warn('Realtime subscriptions are only available when using real API');
      return () => {};
    }

    try {
      // Updated implementation for Supabase channel subscription
      const channel = supabase.channel(`public:${table}`);
      
      if (channel) {
        // Use proper typing for channel.on method
        const subscription = channel.on(
          'postgres_changes', // This is actually allowed in the newer Supabase client
          {
            event: '*', 
            schema: 'public', 
            table 
          }, 
          (payload) => {
            console.log('Change received!', payload);
            callback(payload);
          }
        );

        if (subscription && subscription.subscribe) {
          subscription.subscribe((status) => {
            console.log(`Subscription status for ${table}:`, status);
          });
          
          // Store unsubscribe function
          this.realtimeSubscriptions[table] = () => {
            if (channel) {
              supabase.removeChannel(channel);
            }
          };
        } else {
          console.warn("Subscription object not available");
          this.realtimeSubscriptions[table] = () => {};
        }
      } else {
        console.warn("Channel not available");
        this.realtimeSubscriptions[table] = () => {};
      }
    } catch (error) {
      console.error("Error setting up channel:", error);
      this.realtimeSubscriptions[table] = () => {};
    }
    
    return this.realtimeSubscriptions[table];
  }

  // Unsubscribes from a specific table
  unsubscribe(table: string): void {
    if (this.realtimeSubscriptions[table]) {
      this.realtimeSubscriptions[table]();
      delete this.realtimeSubscriptions[table];
    }
  }

  // Unsubscribes from all tables
  unsubscribeAll(): void {
    Object.keys(this.realtimeSubscriptions).forEach(table => {
      this.realtimeSubscriptions[table]();
    });
    this.realtimeSubscriptions = {};
  }

  // Gets system status data
  async getSystemStatus(): Promise<SystemStatus> {
    if (USE_REAL_API) {
      try {
        const queryResult = await supabase
          .from('system_status')
          .select('*');
          
        if (queryResult.error) throw queryResult.error;
        
        // If we have data and single method, use it
        const data = queryResult.data && queryResult.data.length > 0 
          ? queryResult.data[0] 
          : null;
        
        if (!data) throw new Error('No system status data found');
        
        // Calculate counts based on threat_alerts table
        const alertQueryResult = await supabase
          .from('threat_alerts')
          .select('severity, created_at');
          
        if (alertQueryResult.error) throw alertQueryResult.error;
        
        const alertData = alertQueryResult.data || [];
        
        // Filter alerts from the last 24 hours
        const recentAlerts = alertData.filter(alert => {
          const createdAt = new Date(alert.created_at);
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return createdAt >= yesterday;
        });
        
        const criticalAlerts = recentAlerts.filter(alert => alert.severity === 'critical').length;
        const systemsMonitored = 6; // Fixed number of systems we're monitoring
        
        return {
          activeThreats: recentAlerts.length,
          systemsMonitored,
          alertsToday: recentAlerts.length,
          criticalAlerts
        };
      } catch (error) {
        console.error("Error fetching system status:", error);
        throw error;
      }
    } else {
      await this.delay();
      // Simulating random changes to demonstrate dynamic data
      return {
        ...systemStats,
        activeThreats: systemStats.activeThreats + Math.floor(Math.random() * 3),
        alertsToday: systemStats.alertsToday + Math.floor(Math.random() * 5)
      };
    }
  }

  // Gets anomaly data for the chart
  async getAnomalyData(): Promise<AnomalyData[]> {
    if (USE_REAL_API) {
      try {
        const queryResult = await supabase
          .from('anomaly_logs')
          .select('*');
          
        if (queryResult.error) throw queryResult.error;
        
        const data = queryResult.data || [];
        
        // Sort by timestamp manually if order isn't available
        const sortedData = [...data].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Limit to 50 items
        const limitedData = sortedData.slice(0, 50);
        
        return limitedData.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          score: item.value * 100 // Convert 0-1 to 0-100 for visualization
        }));
      } catch (error) {
        console.error("Error fetching anomaly data:", error);
        throw error;
      }
    } else {
      await this.delay();
      // Add random variation to simulate real-time data
      return anomalyData.map(item => ({
        ...item,
        score: Math.min(100, Math.max(0, item.score + (Math.random() * 10 - 5)))
      }));
    }
  }

  // Gets active alerts
  async getActiveAlerts(): Promise<ThreatAlert[]> {
    if (USE_REAL_API) {
      try {
        const queryResult = await supabase
          .from('threat_alerts')
          .select('*');
          
        if (queryResult.error) throw queryResult.error;
        
        const data = queryResult.data || [];
        
        // Sort by timestamp manually if order isn't available
        const sortedData = [...data].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Limit to 20 items
        const limitedData = sortedData.slice(0, 20);
        
        return limitedData.map(alert => ({
          id: String(alert.id),
          type: alert.type,
          severity: alert.severity as 'critical' | 'warning' | 'info',
          timestamp: new Date(alert.timestamp).toISOString(),
          source_ip: alert.source_ip,
          destination: alert.destination_ip,
          description: `${alert.type} detected from ${alert.source_ip}`
        }));
      } catch (error) {
        console.error("Error fetching active alerts:", error);
        throw error;
      }
    } else {
      await this.delay();
      // Convert legacy format to ThreatAlert format
      return (alertFeedData as LegacyAlert[]).map(alert => ({
        id: String(alert.id),
        type: alert.type,
        severity: alert.severity as 'critical' | 'warning' | 'info',
        timestamp: alert.timestamp,
        source_ip: alert.source,
        destination: alert.destination,
        description: alert.description
      }));
    }
  }

  // Gets network traffic data
  async getNetworkTraffic(): Promise<TrafficData[]> {
    if (USE_REAL_API) {
      try {
        const queryResult = await supabase
          .from('network_traffic')
          .select('*');
          
        if (queryResult.error) throw queryResult.error;
        
        const data = queryResult.data || [];
        
        // Sort by timestamp manually if order isn't available
        const sortedData = [...data].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Limit to 15 items
        const limitedData = sortedData.slice(0, 15);
        
        return limitedData.map(item => ({
          id: item.id,
          timestamp: new Date(item.timestamp).toISOString(),
          sourceIP: item.source_ip,
          destIP: item.dest_ip,
          protocol: item.protocol,
          port: item.port,
          bytes: item.bytes,
          anomalyScore: item.anomaly_score
        }));
      } catch (error) {
        console.error("Error fetching network traffic:", error);
        throw error;
      }
    } else {
      await this.delay();
      return trafficData;
    }
  }

  // Gets system health status
  async getSystemHealth(): Promise<SystemHealth[]> {
    if (USE_REAL_API) {
      try {
        const queryResult = await supabase
          .from('system_status')
          .select('*');
          
        if (queryResult.error) throw queryResult.error;
        
        // Get the first item if available
        const data = queryResult.data && queryResult.data.length > 0 
          ? queryResult.data[0] 
          : null;
        
        if (!data) throw new Error('No system status data found');
        
        // Transform the flat structure into the component's expected format
        return [
          { 
            name: 'Firewall', 
            status: this.getStatusFromLoad(data.firewall_load), 
            load: data.firewall_load 
          },
          { 
            name: 'IDS/IPS', 
            status: this.getStatusFromLoad(data.ids_ips_load), 
            load: data.ids_ips_load 
          },
          { 
            name: 'SIEM', 
            status: this.getStatusFromLoad(data.siem_load), 
            load: data.siem_load 
          },
          { 
            name: 'Email Security', 
            status: this.getStatusFromLoad(data.email_load), 
            load: data.email_load 
          },
          { 
            name: 'Endpoint Protection', 
            status: this.getStatusFromLoad(data.endpoint_load), 
            load: data.endpoint_load 
          },
          { 
            name: 'Network Monitoring', 
            status: this.getStatusFromLoad(data.network_monitoring_load), 
            load: data.network_monitoring_load 
          }
        ];
      } catch (error) {
        console.error("Error fetching system health:", error);
        throw error;
      }
    } else {
      await this.delay();
      return systemHealthData as SystemHealth[];
    }
  }

  // Helper method to determine status based on load
  private getStatusFromLoad(load: number): 'operational' | 'degraded' | 'outage' {
    if (load < 70) return 'operational';
    if (load < 90) return 'degraded';
    return 'outage';
  }

  // Simulates AI analysis of an alert
  async analyzeAlert(alertData: Partial<ThreatAlert>): Promise<{ score: number; classification: string }> {
    if (USE_REAL_API) {
      try {
        // In a real implementation, this would call an AI service
        // For now, we'll generate a synthetic result
        
        // Save the alert to Supabase
        const insertResult = await supabase
          .from('threat_alerts')
          .insert({
            type: alertData.type,
            severity: alertData.severity,
            source_ip: alertData.source_ip,
            destination_ip: alertData.destination,
            timestamp: new Date().toISOString()
          });
          
        if (insertResult.error) throw insertResult.error;
        
        // Generate a synthetic score based on severity
        let score = 0.5;
        if (alertData.severity === 'critical') score = 0.9;
        if (alertData.severity === 'warning') score = 0.7;
        if (alertData.severity === 'info') score = 0.3;
        
        let classification = 'benign';
        if (score > 0.8) classification = 'critical_threat';
        else if (score > 0.5) classification = 'potential_threat';
        
        return {
          score,
          classification
        };
      } catch (error) {
        console.error("Error analyzing alert:", error);
        throw error;
      }
    } else {
      await this.delay(1000); // AI analysis would take longer
      
      // Simulate AI analysis
      const score = Math.random();
      let classification = 'benign';
      
      if (score > 0.8) {
        classification = 'critical_threat';
      } else if (score > 0.5) {
        classification = 'potential_threat';
      }
      
      return {
        score: parseFloat(score.toFixed(2)),
        classification
      };
    }
  }

  // Simulates log file analysis
  async analyzeLogFile(file: File): Promise<{ threatDetected: boolean; anomalyScore: number; suspiciousEntries?: string[] }> {
    if (USE_REAL_API) {
      try {
        // In a real implementation, this would:
        // 1. Upload the file to Supabase Storage
        // 2. Trigger a serverless function to analyze it
        // 3. Store results in the database
        
        // For now, we'll simulate this flow
        
        // Read file content
        const content = await this.readFileContent(file);
        
        // Simulate analysis by looking for keywords
        const lines = content.split('\n');
        const suspiciousEntries = lines.filter(line => 
          line.toLowerCase().includes('error') || 
          line.toLowerCase().includes('failed') ||
          line.toLowerCase().includes('unauthorized') ||
          line.toLowerCase().includes('denied')
        );
        
        // Calculate an anomaly score based on suspicious entries
        const anomalyScore = Math.min(1, suspiciousEntries.length / 10);
        const threatDetected = anomalyScore > 0.7;
        
        // Store results in Supabase
        const insertResult = await supabase
          .from('processed_logs')
          .insert({
            file_name: file.name,
            suspicious_entries: suspiciousEntries,
            uploaded_at: new Date().toISOString()
          });
          
        if (insertResult.error) throw insertResult.error;
        
        return {
          threatDetected,
          anomalyScore,
          suspiciousEntries: suspiciousEntries.slice(0, 5) // Return top 5 suspicious lines
        };
      } catch (error) {
        console.error("Error analyzing log file:", error);
        throw error;
      }
    } else {
      await this.delay(2000); // Simulating file processing
      
      // Simulate analysis result
      const anomalyScore = Math.random();
      return {
        threatDetected: anomalyScore > 0.7,
        anomalyScore: parseFloat(anomalyScore.toFixed(2))
      };
    }
  }
  
  // Helper method to read file content
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

// Export a single instance of the service to be used throughout the application
export const apiService = new ApiService();
export { API, supabase };  // Export Axios instance and Supabase client for direct use if needed
