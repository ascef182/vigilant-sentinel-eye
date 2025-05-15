
import { supabase } from '../supabaseClient';
import { ThreatAlert, LegacyAlert } from '@/types/api';
import { alertFeedData } from '@/lib/mock-data';
import { USE_REAL_API } from './constants';

/**
 * Service for threat alerts data
 */
export class AlertService {
  // Simulates network delay for mock data
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
}

// Export singleton instance
export const alertService = new AlertService();
