
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
      console.log('VirusTotal API key set:', key);
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
    try {
      return await getFromCacheOrApi(`file_${hash}`, async () => {
        console.log('Fetching VirusTotal file report for hash:', hash);
        const response = await axios.get(`${this.baseUrl}/files/${hash}`, { 
          headers: this.getHeaders() 
        });
        return response.data.data;
      }, this.cacheExpirationHours);
    } catch (error) {
      console.error('VirusTotal API error (getFileReport):', error);
      throw error;
    }
  }

  // Analyze an IP address
  async getIpReport(ip: string): Promise<VirusTotalResult> {
    try {
      return await getFromCacheOrApi(`ip_${ip}`, async () => {
        console.log('Fetching VirusTotal IP report for:', ip);
        const response = await axios.get(`${this.baseUrl}/ip_addresses/${ip}`, { 
          headers: this.getHeaders() 
        });
        return response.data.data;
      }, this.cacheExpirationHours);
    } catch (error) {
      console.error('VirusTotal API error (getIpReport):', error);
      throw error;
    }
  }

  // Analyze a domain
  async getDomainReport(domain: string): Promise<VirusTotalResult> {
    try {
      return await getFromCacheOrApi(`domain_${domain}`, async () => {
        console.log('Fetching VirusTotal domain report for:', domain);
        const response = await axios.get(`${this.baseUrl}/domains/${domain}`, { 
          headers: this.getHeaders() 
        });
        return response.data.data;
      }, this.cacheExpirationHours);
    } catch (error) {
      console.error('VirusTotal API error (getDomainReport):', error, 'API Key:', this.apiKey ? 'Set' : 'Not set');
      throw error;
    }
  }

  // Analyze a URL (cached by normalized URL)
  async scanUrl(url: string): Promise<string> {
    try {
      // URL submissions are not cached as we want fresh analysis
      if (!this.apiKey) {
        throw new Error('VirusTotal API key not set');
      }

      const formData = new URLSearchParams();
      formData.append('url', url);

      console.log('Submitting URL for scanning:', url);
      const response = await axios.post(`${this.baseUrl}/urls`, formData, {
        headers: {
          'x-apikey': this.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.data.id;
    } catch (error) {
      console.error('VirusTotal API error (scanUrl):', error);
      throw error;
    }
  }

  // Get URL scan results
  async getUrlReport(urlId: string): Promise<VirusTotalResult> {
    try {
      return await getFromCacheOrApi(`url_${urlId}`, async () => {
        console.log('Fetching URL analysis result for ID:', urlId);
        const response = await axios.get(`${this.baseUrl}/analyses/${urlId}`, { 
          headers: this.getHeaders() 
        });
        return response.data.data;
      }, this.cacheExpirationHours);
    } catch (error) {
      console.error('VirusTotal API error (getUrlReport):', error);
      throw error;
    }
  }

  // Upload a file for analysis
  async uploadFile(file: File): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('VirusTotal API key not set');
      }

      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file for analysis:', file.name);
      // Upload file
      const response = await axios.post(`${this.baseUrl}/files`, formData, {
        headers: {
          'x-apikey': this.apiKey,
        },
      });

      // Return the analysis ID
      return response.data.data.id;
    } catch (error) {
      console.error('VirusTotal API error (uploadFile):', error);
      throw error;
    }
  }

  // Get analysis results
  async getAnalysisReport(analysisId: string): Promise<VirusTotalResult> {
    try {
      return await getFromCacheOrApi(`analysis_${analysisId}`, async () => {
        console.log('Fetching analysis report for ID:', analysisId);
        const response = await axios.get(`${this.baseUrl}/analyses/${analysisId}`, { 
          headers: this.getHeaders() 
        });
        return response.data.data;
      }, this.cacheExpirationHours);
    } catch (error) {
      console.error('VirusTotal API error (getAnalysisReport):', error);
      throw error;
    }
  }
}

// Export the utility function directly
export { calculateThreatScore };

// Export a singleton instance
export const virusTotalService = new VirusTotalService();
