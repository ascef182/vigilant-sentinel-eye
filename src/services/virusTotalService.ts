
import axios from 'axios';
import { VirusTotalResult } from '@/types/virusTotal';
import { getFromCacheOrApi } from './virusTotalCache';
import { calculateThreatScore } from './virusTotalUtils';

class VirusTotalService {
  private readonly baseUrl = 'https://www.virustotal.com/api/v3';
  private readonly cacheExpirationHours = 24;
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from localStorage for development purposes
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('virusTotalApiKey');
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    // Cache the key in localStorage for development use
    if (typeof window !== 'undefined') {
      localStorage.setItem('virusTotalApiKey', key);
    }
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error('VirusTotal API key not set');
    }

    return {
      'x-apikey': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // Analyze a file by hash (MD5, SHA-1, or SHA-256)
  async getFileReport(hash: string): Promise<VirusTotalResult> {
    return getFromCacheOrApi(`file_${hash}`, async () => {
      const response = await axios.get(`${this.baseUrl}/files/${hash}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    }, this.cacheExpirationHours);
  }

  // Analyze an IP address
  async getIpReport(ip: string): Promise<VirusTotalResult> {
    return getFromCacheOrApi(`ip_${ip}`, async () => {
      const response = await axios.get(`${this.baseUrl}/ip_addresses/${ip}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    }, this.cacheExpirationHours);
  }

  // Analyze a domain
  async getDomainReport(domain: string): Promise<VirusTotalResult> {
    return getFromCacheOrApi(`domain_${domain}`, async () => {
      const response = await axios.get(`${this.baseUrl}/domains/${domain}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    }, this.cacheExpirationHours);
  }

  // Analyze a URL (cached by normalized URL)
  async scanUrl(url: string): Promise<string> {
    // URL submissions are not cached as we want fresh analysis
    if (!this.apiKey) {
      throw new Error('VirusTotal API key not set');
    }

    const formData = new URLSearchParams();
    formData.append('url', url);

    const response = await axios.post(`${this.baseUrl}/urls`, formData, {
      headers: {
        'x-apikey': this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.data.id;
  }

  // Get URL scan results
  async getUrlReport(urlId: string): Promise<VirusTotalResult> {
    return getFromCacheOrApi(`url_${urlId}`, async () => {
      const response = await axios.get(`${this.baseUrl}/analyses/${urlId}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    }, this.cacheExpirationHours);
  }

  // Upload a file for analysis
  async uploadFile(file: File): Promise<string> {
    if (!this.apiKey) {
      throw new Error('VirusTotal API key not set');
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    // Upload file
    const response = await axios.post(`${this.baseUrl}/files`, formData, {
      headers: {
        'x-apikey': this.apiKey,
      },
    });

    // Return the analysis ID
    return response.data.data.id;
  }

  // Get analysis results
  async getAnalysisReport(analysisId: string): Promise<VirusTotalResult> {
    return getFromCacheOrApi(`analysis_${analysisId}`, async () => {
      const response = await axios.get(`${this.baseUrl}/analyses/${analysisId}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    }, this.cacheExpirationHours);
  }
}

// Export the utility function directly
export { calculateThreatScore };

// Export a singleton instance
export const virusTotalService = new VirusTotalService();
