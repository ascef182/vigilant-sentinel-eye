
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { ThreatAlert } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function useSystemStatus() {
  return useQuery({
    queryKey: ['systemStatus'],
    queryFn: () => apiService.getSystemStatus(),
    refetchInterval: 30000, // Atualiza a cada 30 segundos
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
    refetchInterval: 60000, // Atualiza a cada minuto
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
    refetchInterval: 15000, // Atualiza a cada 15 segundos
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
    refetchInterval: 20000, // Atualiza a cada 20 segundos
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
    refetchInterval: 45000, // Atualiza a cada 45 segundos
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
        title: 'Alerta Analisado',
        description: `Classificação: ${data.classification} (Score: ${data.score})`,
        variant: data.score > 0.8 ? 'destructive' : data.score > 0.5 ? 'default' : 'default',
      });
    },
    onError: (error) => {
      console.error('Failed to analyze alert:', error);
      toast({
        title: 'Erro na Análise',
        description: 'Não foi possível processar este alerta',
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
      toast({
        title: data.threatDetected ? 'Ameaça Detectada!' : 'Análise Concluída',
        description: `Score de Anomalia: ${data.anomalyScore}`,
        variant: data.threatDetected ? 'destructive' : 'default',
      });
    },
    onError: (error) => {
      console.error('Failed to analyze log file:', error);
      toast({
        title: 'Erro no Processamento',
        description: 'Não foi possível analisar este arquivo',
        variant: 'destructive',
      });
    }
  });
}
