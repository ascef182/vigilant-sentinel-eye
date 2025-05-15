
import { supabase } from '../supabaseClient';
import { AnomalyData, TrafficData } from '@/types/api';
import { anomalyData, trafficData } from '@/lib/mock-data';
import { USE_REAL_API } from './constants';

/**
 * Service for network traffic and anomaly data
 */
export class NetworkService {
  // Simulates network delay for mock data
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
}

// Export singleton instance
export const networkService = new NetworkService();
