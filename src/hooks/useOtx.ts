import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { otxService } from '@/services/otx';
import { useToast } from './use-toast';
import { apiService } from '@/services/api';

export function useOtx() {
  const { toast } = useToast();
  const [apiKey, setApiKeyState] = useState<string>('');

  // Set OTX API key
  const setApiKey = (key: string) => {
    if (!key) {
      toast({
        title: "API Key Error",
        description: "Por favor, forneça uma chave API válida",
        variant: "destructive",
      });
      return;
    }
    
    otxService.setApiKey(key);
    setApiKeyState(key);
    
    toast({
      title: "API Key Configurada",
      description: "Chave API da OTX configurada com sucesso",
    });
  };

  // Get latest pulses
  const useLatestPulses = (limit: number = 10) => {
    return useQuery({
      queryKey: ['otxPulses', limit],
      queryFn: () => otxService.getPulses(limit),
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
  };

  // Check IP against OTX
  const checkIp = useMutation({
    mutationFn: async (ip: string) => {
      const result = await otxService.getIpInfo(ip);
      
      // Create threat alert if malicious
      if (result?.pulse_info?.count > 0) {
        const pulseCount = result.pulse_info.count;
        const severity = pulseCount > 10 ? 'critical' : pulseCount > 3 ? 'warning' : 'info';
        
        await apiService.analyzeAlert({
          type: 'OTX IP Threat',
          severity,
          source_ip: ip,
          description: `Endereço IP encontrado em ${pulseCount} pulses da OTX. Possível ameaça detectada.`,
        });
        
        toast({
          title: "Ameaça Detectada",
          description: `IP ${ip} encontrado em ${pulseCount} feeds de ameaça da OTX`,
          variant: severity === 'critical' ? 'destructive' : 'default',
        });
      }
      
      return result;
    },
  });

  // Check domain against OTX
  const checkDomain = useMutation({
    mutationFn: async (domain: string) => {
      const result = await otxService.getDomainInfo(domain);
      
      // Create threat alert if malicious
      if (result?.pulse_info?.count > 0) {
        const pulseCount = result.pulse_info.count;
        const severity = pulseCount > 10 ? 'critical' : pulseCount > 3 ? 'warning' : 'info';
        
        await apiService.analyzeAlert({
          type: 'OTX Domain Threat',
          severity,
          destination: domain,
          description: `Domínio encontrado em ${pulseCount} pulses da OTX. Possível ameaça detectada.`,
        });
        
        toast({
          title: "Ameaça Detectada",
          description: `Domínio ${domain} encontrado em ${pulseCount} feeds de ameaça da OTX`,
          variant: severity === 'critical' ? 'destructive' : 'default',
        });
      }
      
      return result;
    },
  });

  // Check file hash against OTX
  const checkFileHash = useMutation({
    mutationFn: async (hash: string) => {
      const result = await otxService.getFileInfo(hash);
      
      // Create threat alert if malicious
      if (result?.pulse_info?.count > 0) {
        const pulseCount = result.pulse_info.count;
        const severity = pulseCount > 5 ? 'critical' : pulseCount > 2 ? 'warning' : 'info';
        
        await apiService.analyzeAlert({
          type: 'OTX Hash Threat',
          severity,
          description: `Hash de arquivo encontrado em ${pulseCount} pulses da OTX. Possível malware detectado.`,
        });
        
        toast({
          title: "Ameaça Detectada",
          description: `Hash ${hash} encontrado em ${pulseCount} feeds de ameaça da OTX`,
          variant: severity === 'critical' ? 'destructive' : 'default',
        });
      }
      
      return result;
    },
  });

  // Get global threat map data
  const useGlobalThreatMap = () => {
    return useQuery({
      queryKey: ['otxThreatMap'],
      queryFn: () => otxService.getGlobalThreatMap(),
      refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
    });
  };

  return {
    apiKey,
    setApiKey,
    useLatestPulses,
    checkIp,
    checkDomain,
    checkFileHash,
    useGlobalThreatMap,
  };
}
