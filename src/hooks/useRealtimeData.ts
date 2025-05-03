
import { useEffect, useState } from 'react';
import { apiService, supabase } from '@/services/apiService';
import { ThreatAlert, TrafficData, AnomalyData } from '@/types/api';
import { useToast } from './use-toast';

export function useRealtimeAlerts(initialData: ThreatAlert[] = []) {
  const [alerts, setAlerts] = useState<ThreatAlert[]>(initialData);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data load
    apiService.getActiveAlerts().then(setAlerts);

    // Set up realtime subscription
    const unsubscribe = apiService.subscribeToTable('threat_alerts', (payload) => {
      if (payload.eventType === 'INSERT') {
        const newAlert = payload.new as ThreatAlert;
        setAlerts(prev => [newAlert, ...prev]);
        
        toast({
          title: 'New Threat Detected',
          description: `${newAlert.type} from ${newAlert.source_ip}`,
          variant: newAlert.severity === 'critical' ? 'destructive' : 'default',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return alerts;
}

export function useRealtimeTraffic(initialData: TrafficData[] = []) {
  const [traffic, setTraffic] = useState<TrafficData[]>(initialData);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data load
    apiService.getNetworkTraffic().then(setTraffic);

    // Set up realtime subscription
    const unsubscribe = apiService.subscribeToTable('network_traffic', (payload) => {
      if (payload.eventType === 'INSERT') {
        const newTraffic = payload.new as TrafficData;
        setTraffic(prev => [newTraffic, ...prev.slice(0, 14)]); // Keep last 15 items
        
        if (newTraffic.anomalyScore > 0.8) {
          toast({
            title: 'Suspicious Traffic Detected',
            description: `High anomaly score (${newTraffic.anomalyScore.toFixed(2)}) from ${newTraffic.sourceIP}`,
            variant: 'destructive',
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return traffic;
}

export function useRealtimeAnomalyData(initialData: AnomalyData[] = []) {
  const [anomalyData, setAnomalyData] = useState<AnomalyData[]>(initialData);

  useEffect(() => {
    // Initial data load
    apiService.getAnomalyData().then(setAnomalyData);

    // Set up realtime subscription
    const unsubscribe = apiService.subscribeToTable('anomaly_logs', (payload) => {
      if (payload.eventType === 'INSERT') {
        const newData = {
          time: new Date(payload.new.timestamp).toLocaleTimeString(),
          score: payload.new.value * 100 // Convert 0-1 to 0-100
        };
        
        setAnomalyData(prev => [...prev, newData].slice(-50)); // Keep last 50 items
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return anomalyData;
}
