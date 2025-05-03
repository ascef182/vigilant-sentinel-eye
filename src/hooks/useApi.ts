
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { ThreatAlert } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function useSystemStatus() {
  return useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getSystemStatus(),
    refetchInterval: 30000, // Update every 30 seconds
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch system status:', error);
      }
    }
  });
}

export function useAnomalyData() {
  return useQuery({
    queryKey: ['anomalyData'],
    queryFn: () => apiService.getAnomalyData(),
    refetchInterval: 60000, // Update every minute
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch anomaly data:', error);
      }
    }
  });
}

export function useActiveAlerts() {
  return useQuery({
    queryKey: ['activeAlerts'],
    queryFn: () => apiService.getActiveAlerts(),
    refetchInterval: 15000, // Update every 15 seconds
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch active alerts:', error);
      }
    }
  });
}

export function useNetworkTraffic() {
  return useQuery({
    queryKey: ['networkTraffic'],
    queryFn: () => apiService.getNetworkTraffic(),
    refetchInterval: 20000, // Update every 20 seconds
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch network traffic:', error);
      }
    }
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => apiService.getSystemHealth(),
    refetchInterval: 45000, // Update every 45 seconds
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch system health:', error);
      }
    }
  });
}

export function useAnalyzeAlert() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (alert: Partial<ThreatAlert>) => apiService.analyzeAlert(alert),
    onSuccess: (data) => {
      toast({
        title: 'Alert Analyzed',
        description: `Classification: ${data.classification} (Score: ${data.score})`,
        variant: data.score > 0.8 ? 'destructive' : data.score > 0.5 ? 'default' : 'default',
      });
    },
    onError: (error) => {
      console.error('Failed to analyze alert:', error);
      toast({
        title: 'Analysis Error',
        description: 'Unable to process this alert',
        variant: 'destructive',
      });
    }
  });
}

export function useAnalyzeLogFile() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (file: File) => apiService.analyzeLogFile(file),
    onSuccess: (data) => {
      const description = data.suspiciousEntries?.length 
        ? `Found ${data.suspiciousEntries.length} suspicious entries` 
        : `Anomaly Score: ${data.anomalyScore}`;
        
      toast({
        title: data.threatDetected ? 'Threat Detected!' : 'Analysis Complete',
        description,
        variant: data.threatDetected ? 'destructive' : 'default',
      });
    },
    onError: (error) => {
      console.error('Failed to analyze log file:', error);
      toast({
        title: 'Processing Error',
        description: 'Unable to analyze this file',
        variant: 'destructive',
      });
    }
  });
}
