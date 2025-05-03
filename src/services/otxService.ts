
import axios from 'axios';
import { supabase } from './supabaseClient';

// OTX API configuration
const API_ROOT = 'https://otx.alienvault.com/api/v1';
const DEFAULT_API_KEY = 'd1c99461a89907608c5de2f9450082785f5fa4eb183993a78f30ee5000255da6';

/**
 * OTX API Service for threat intelligence
 */
class OtxService {
  private apiKey: string = '';
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OTX_API_KEY || DEFAULT_API_KEY;
  }

  /**
   * Sets the API key for OTX
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Gets current pulses (threat intelligence feeds)
   */
  async getPulses(limit: number = 10): Promise<any> {
    try {
      const cacheKey = `pulses_${limit}`;
      const cachedData = await this.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log('Using cached OTX pulses data');
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/pulses/subscribed`, {
        headers: { 'X-OTX-API-KEY': this.apiKey },
        params: { limit }
      });
      
      await this.saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching OTX pulses:', error);
      return { results: [] };
    }
  }

  /**
   * Gets information about an IP address
   */
  async getIpInfo(ip: string): Promise<any> {
    try {
      const cacheKey = `ip_${ip}`;
      const cachedData = await this.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Using cached data for IP: ${ip}`);
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/indicators/IPv4/${ip}`, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      });
      
      await this.saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching OTX info for IP ${ip}:`, error);
      return null;
    }
  }

  /**
   * Gets information about a domain
   */
  async getDomainInfo(domain: string): Promise<any> {
    try {
      const cacheKey = `domain_${domain}`;
      const cachedData = await this.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Using cached data for domain: ${domain}`);
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/indicators/domain/${domain}`, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      });
      
      await this.saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching OTX info for domain ${domain}:`, error);
      return null;
    }
  }

  /**
   * Gets information about a file hash
   */
  async getFileInfo(hash: string): Promise<any> {
    try {
      const cacheKey = `file_${hash}`;
      const cachedData = await this.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Using cached data for file hash: ${hash}`);
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/indicators/file/${hash}`, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      });
      
      await this.saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching OTX info for file hash ${hash}:`, error);
      return null;
    }
  }

  /**
   * Gets global threat indicators for the map visualization
   */
  async getGlobalThreatMap(): Promise<any> {
    try {
      const cacheKey = 'global_threat_map';
      const cachedData = await this.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log('Using cached global threat map data');
        return cachedData;
      }
      
      // Get latest pulses
      const pulses = await this.getPulses(50);
      
      // Process pulses to extract geographic information
      // This is a simplified approach - in a real implementation,
      // we'd need to process the indicators in each pulse to extract
      // geographic information through IP geolocation
      const threatMap = this.processPulsesForMap(pulses);
      
      await this.saveToCache(cacheKey, threatMap);
      return threatMap;
    } catch (error) {
      console.error('Error generating global threat map:', error);
      return { regions: [] };
    }
  }

  /**
   * Process pulses to extract geographic data for the map
   * This is a mock implementation - in a real scenario, 
   * we'd need to geolocate IPs from the indicators
   */
  private processPulsesForMap(pulses: any): any {
    if (!pulses.results || !Array.isArray(pulses.results)) {
      return { regions: [] };
    }
    
    // Mock implementation - in a real scenario we would use
    // geolocation data from the indicators in the pulses
    const mockRegions = [
      { id: 'US', name: 'United States', count: Math.floor(Math.random() * 100) + 20 },
      { id: 'RU', name: 'Russia', count: Math.floor(Math.random() * 100) + 15 },
      { id: 'CN', name: 'China', count: Math.floor(Math.random() * 100) + 25 },
      { id: 'BR', name: 'Brazil', count: Math.floor(Math.random() * 50) + 10 },
      { id: 'IN', name: 'India', count: Math.floor(Math.random() * 40) + 5 },
      { id: 'UK', name: 'United Kingdom', count: Math.floor(Math.random() * 30) + 8 },
      { id: 'DE', name: 'Germany', count: Math.floor(Math.random() * 25) + 7 },
      { id: 'IR', name: 'Iran', count: Math.floor(Math.random() * 20) + 10 },
      { id: 'KP', name: 'North Korea', count: Math.floor(Math.random() * 15) + 5 },
    ];
    
    return { regions: mockRegions };
  }

  /**
   * Saves data to the cache
   */
  private async saveToCache(key: string, data: any): Promise<void> {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('otx_cache')
        .insert({
          key,
          data,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
    } catch (e) {
      console.warn('Failed to cache OTX data:', e);
      // If insert failed (possibly due to unique constraint), try upsert
      try {
        await supabase
          .from('otx_cache')
          .insert({
            key,
            data,
            created_at: new Date().toISOString()
          }, { upsert: true });
      } catch (err) {
        console.error('Failed to update OTX cache:', err);
      }
    }
  }

  /**
   * Gets data from the cache
   */
  private async getFromCache(key: string): Promise<any | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('otx_cache')
        .select('*')
        .eq('key', key)
        .single();
        
      if (error) return null;
      
      // Check if the cache is still valid (less than 1 hour old)
      const createdAt = new Date(data.created_at);
      const now = new Date();
      const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (diffHours > 1) {
        console.log(`Cache expired for ${key}`);
        return null;
      }
      
      return data.data;
    } catch (e) {
      console.warn('Failed to retrieve from OTX cache:', e);
      return null;
    }
  }
}

// Export singleton instance
export const otxService = new OtxService();
