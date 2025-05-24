
import { supabase } from '../supabaseClient';
import { SystemStatus, SystemHealth } from '@/types/api';
import { systemStats } from '@/lib/mock-data';
import { USE_REAL_API } from './constants';

/**
 * Service for system status related data
 */
export class StatusService {
  // Simulates network delay for mock data
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
          status: data.status || 'online',
          uptime: data.uptime || 0,
          lastCheck: data.last_check || new Date().toISOString(),
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
            load: data.firewall_load,
            cpu: data.firewall_load,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
          },
          { 
            name: 'IDS/IPS', 
            status: this.getStatusFromLoad(data.ids_ips_load), 
            load: data.ids_ips_load,
            cpu: data.ids_ips_load,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
          },
          { 
            name: 'SIEM', 
            status: this.getStatusFromLoad(data.siem_load), 
            load: data.siem_load,
            cpu: data.siem_load,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
          },
          { 
            name: 'Email Security', 
            status: this.getStatusFromLoad(data.email_load), 
            load: data.email_load,
            cpu: data.email_load,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
          },
          { 
            name: 'Endpoint Protection', 
            status: this.getStatusFromLoad(data.endpoint_load), 
            load: data.endpoint_load,
            cpu: data.endpoint_load,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
          },
          { 
            name: 'Network Monitoring', 
            status: this.getStatusFromLoad(data.network_monitoring_load), 
            load: data.network_monitoring_load,
            cpu: data.network_monitoring_load,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
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
}

// Reference to mock data
import { systemHealthData } from '@/lib/mock-data';

// Export singleton instance
export const statusService = new StatusService();
