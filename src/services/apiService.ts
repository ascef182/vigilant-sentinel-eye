
import { ThreatAlert, SystemStatus, AnomalyData, TrafficData, SystemHealth, LegacyAlert } from '@/types/api';
import { 
  alertFeedData, 
  anomalyData, 
  systemStats, 
  trafficData, 
  systemHealthData 
} from '@/lib/mock-data';

// Esta classe simula um serviço de API que no futuro pode ser
// substituído por chamadas reais para um backend FastAPI
class ApiService {
  // Simula um atraso de rede
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtém dados do status do sistema
  async getSystemStatus(): Promise<SystemStatus> {
    await this.delay();
    // Simulando modificações aleatórias para demonstrar dados dinâmicos
    return {
      ...systemStats,
      activeThreats: systemStats.activeThreats + Math.floor(Math.random() * 3),
      alertsToday: systemStats.alertsToday + Math.floor(Math.random() * 5)
    };
  }

  // Obtém os dados de anomalias para o gráfico
  async getAnomalyData(): Promise<AnomalyData[]> {
    await this.delay();
    // Adiciona alguma variação aleatória para simular dados em tempo real
    return anomalyData.map(item => ({
      ...item,
      score: Math.min(100, Math.max(0, item.score + (Math.random() * 10 - 5)))
    }));
  }

  // Obtém alertas ativos
  async getActiveAlerts(): Promise<ThreatAlert[]> {
    await this.delay();
    // Converter o formato antigo para o novo formato ThreatAlert
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

  // Obtém dados de tráfego de rede
  async getNetworkTraffic(): Promise<TrafficData[]> {
    await this.delay();
    return trafficData;
  }

  // Obtém status de saúde do sistema
  async getSystemHealth(): Promise<SystemHealth[]> {
    await this.delay();
    return systemHealthData as SystemHealth[];
  }

  // Simula o envio de um alerta para análise pelo modelo de IA
  async analyzeAlert(alertData: Partial<ThreatAlert>): Promise<{ score: number; classification: string }> {
    await this.delay(1000); // Análise de IA levaria mais tempo
    
    // Simulação da análise de IA
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

  // Simula a análise de um arquivo de log
  async analyzeLogFile(file: File): Promise<{ threatDetected: boolean; anomalyScore: number }> {
    await this.delay(2000); // Simulando processamento de arquivo
    
    // Simula resultado de análise
    const anomalyScore = Math.random();
    return {
      threatDetected: anomalyScore > 0.7,
      anomalyScore: parseFloat(anomalyScore.toFixed(2))
    };
  }
}

// Exporta uma única instância do serviço para ser usada em toda a aplicação
export const apiService = new ApiService();
