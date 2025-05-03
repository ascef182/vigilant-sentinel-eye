
import axios from 'axios';
import { supabase } from './apiService';

// VirusTotal API interface
export interface VirusTotalResult {
  id: string;
  type: string;
  attributes: {
    last_analysis_stats: {
      harmless: number;
      malicious: number;
      suspicious: number;
      undetected: number;
      timeout: number;
    };
    last_analysis_results: Record<string, any>;
    reputation: number;
    total_votes: {
      harmless: number;
      malicious: number;
    };
    [key: string]: any;
  };
  links?: {
    self: string;
  };
}

interface CachedResult {
  timestamp: string;
  result: VirusTotalResult;
}

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

  // Check cache before making API requests
  private async getFromCacheOrApi<T>(
    cacheKey: string, 
    apiFn: () => Promise<T>
  ): Promise<T> {
    try {
      // Check if we have a cached result
      const { data } = await supabase
        .from('virustotal_cache')
        .select('*')
        .eq('key', cacheKey)
        .single();

      if (data) {
        const cachedData = data as unknown as { key: string, result: T, timestamp: string };
        const cacheTime = new Date(cachedData.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);

        // Return cached data if it's not expired
        if (hoursDiff < this.cacheExpirationHours) {
          console.log('Using cached VirusTotal data for:', cacheKey);
          return cachedData.result;
        }
      }

      // If no cached data or expired, call the API
      const result = await apiFn();
      
      // Update cache
      await supabase
        .from('virustotal_cache')
        .upsert({ 
          key: cacheKey, 
          result, 
          timestamp: new Date().toISOString() 
        }, { onConflict: 'key' });

      return result;
    } catch (error) {
      console.error('Cache/API error:', error);
      // If cache fails, still try the API directly
      return apiFn();
    }
  }

  // Analyze a file by hash (MD5, SHA-1, or SHA-256)
  async getFileReport(hash: string): Promise<VirusTotalResult> {
    return this.getFromCacheOrApi(`file_${hash}`, async () => {
      const response = await axios.get(`${this.baseUrl}/files/${hash}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    });
  }

  // Analyze an IP address
  async getIpReport(ip: string): Promise<VirusTotalResult> {
    return this.getFromCacheOrApi(`ip_${ip}`, async () => {
      const response = await axios.get(`${this.baseUrl}/ip_addresses/${ip}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    });
  }

  // Analyze a domain
  async getDomainReport(domain: string): Promise<VirusTotalResult> {
    return this.getFromCacheOrApi(`domain_${domain}`, async () => {
      const response = await axios.get(`${this.baseUrl}/domains/${domain}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    });
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
    return this.getFromCacheOrApi(`url_${urlId}`, async () => {
      const response = await axios.get(`${this.baseUrl}/analyses/${urlId}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    });
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
    return this.getFromCacheOrApi(`analysis_${analysisId}`, async () => {
      const response = await axios.get(`${this.baseUrl}/analyses/${analysisId}`, { 
        headers: this.getHeaders() 
      });
      return response.data.data;
    });
  }

  // Helper function to calculate threat score from VirusTotal results
  calculateThreatScore(result: VirusTotalResult): number {
    if (!result || !result.attributes || !result.attributes.last_analysis_stats) {
      return 0;
    }

    const stats = result.attributes.last_analysis_stats;
    const totalChecks = stats.harmless + stats.malicious + stats.suspicious + 
                         stats.undetected + stats.timeout;
    
    // Weight malicious as 1.0, suspicious as 0.5
    const score = (stats.malicious + (stats.suspicious * 0.5)) / totalChecks;
    
    // Return a normalized score between 0 and 1
    return Math.min(1, Math.max(0, score));
  }
}

// Export a singleton instance
export const virusTotalService = new VirusTotalService();
