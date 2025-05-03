
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { virusTotalService, calculateThreatScore } from '@/services/virusTotalService';
import { useToast } from './use-toast';
import { ThreatAlert } from '@/types/api';
import { apiService } from '@/services/apiService';
import { VirusTotalResult } from '@/types/virusTotal';

export function useVirusTotal() {
  const { toast } = useToast();
  const [apiKeySet, setApiKeySet] = useState<boolean>(virusTotalService.hasApiKey());

  // Set API key
  const setApiKey = (key: string) => {
    virusTotalService.setApiKey(key);
    setApiKeySet(true);
    toast({
      title: "API Key Set",
      description: "VirusTotal API key has been configured",
    });
  };

  // Analyze an IP address
  const analyzeIp = useMutation({
    mutationFn: async (ip: string) => {
      const result = await virusTotalService.getIpReport(ip);
      const threatScore = calculateThreatScore(result);
      
      // If threat score is significant, create an alert
      if (threatScore > 0.3) {
        await createThreatAlert({
          type: 'Suspicious IP',
          severity: threatScore > 0.7 ? 'critical' : threatScore > 0.5 ? 'warning' : 'info',
          source_ip: ip,
          description: `VirusTotal detected this IP as potentially malicious (Score: ${(threatScore * 100).toFixed(1)}%)`,
        });
      }
      
      return { result, threatScore };
    },
  });

  // Analyze a domain
  const analyzeDomain = useMutation({
    mutationFn: async (domain: string) => {
      const result = await virusTotalService.getDomainReport(domain);
      const threatScore = calculateThreatScore(result);
      
      // If threat score is significant, create an alert
      if (threatScore > 0.3) {
        await createThreatAlert({
          type: 'Suspicious Domain',
          severity: threatScore > 0.7 ? 'critical' : threatScore > 0.5 ? 'warning' : 'info',
          destination: domain,
          description: `VirusTotal detected this domain as potentially malicious (Score: ${(threatScore * 100).toFixed(1)}%)`,
        });
      }
      
      return { result, threatScore };
    },
  });

  // Analyze a URL
  const analyzeUrl = useMutation({
    mutationFn: async (url: string) => {
      // First submit the URL for scanning
      const scanId = await virusTotalService.scanUrl(url);
      
      // Then get the report using the returned ID
      const result = await virusTotalService.getUrlReport(scanId);
      const threatScore = calculateThreatScore(result);
      
      // If threat score is significant, create an alert
      if (threatScore > 0.3) {
        await createThreatAlert({
          type: 'Suspicious URL',
          severity: threatScore > 0.7 ? 'critical' : threatScore > 0.5 ? 'warning' : 'info',
          destination: url,
          description: `VirusTotal detected this URL as potentially malicious (Score: ${(threatScore * 100).toFixed(1)}%)`,
        });
      }
      
      return { result, threatScore, url };
    },
  });

  // Analyze a file by hash
  const analyzeFileHash = useMutation({
    mutationFn: async (hash: string) => {
      const result = await virusTotalService.getFileReport(hash);
      const threatScore = calculateThreatScore(result);
      
      // If threat score is significant, create an alert
      if (threatScore > 0.3) {
        await createThreatAlert({
          type: 'Suspicious File Hash',
          severity: threatScore > 0.7 ? 'critical' : threatScore > 0.5 ? 'warning' : 'info',
          description: `VirusTotal detected this file hash as potentially malicious (Score: ${(threatScore * 100).toFixed(1)}%)`,
        });
      }
      
      return { result, threatScore };
    },
  });

  // Upload and analyze a file
  const analyzeFile = useMutation({
    mutationFn: async (file: File) => {
      // First upload the file
      const analysisId = await virusTotalService.uploadFile(file);
      
      // Then get the analysis report
      const result = await virusTotalService.getAnalysisReport(analysisId);
      const threatScore = calculateThreatScore(result);
      
      // If threat score is significant, create an alert
      if (threatScore > 0.3) {
        await createThreatAlert({
          type: 'Suspicious File',
          severity: threatScore > 0.7 ? 'critical' : threatScore > 0.5 ? 'warning' : 'info',
          description: `VirusTotal detected the file "${file.name}" as potentially malicious (Score: ${(threatScore * 100).toFixed(1)}%)`,
        });
      }
      
      return { result, threatScore, fileName: file.name };
    },
  });

  // Helper function to create threat alerts
  const createThreatAlert = async (alertData: Partial<ThreatAlert>) => {
    try {
      await apiService.analyzeAlert(alertData);
    } catch (error) {
      console.error("Failed to create threat alert:", error);
    }
  };

  return {
    apiKeySet,
    setApiKey,
    analyzeIp,
    analyzeDomain,
    analyzeUrl,
    analyzeFileHash,
    analyzeFile
  };
}
