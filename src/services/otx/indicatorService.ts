
import axios from 'axios';
import { API_ROOT } from './constants';
import { otxCacheService } from './cacheService';

/**
 * Service for handling OTX indicator lookups (IP, Domain, File Hash)
 */
export class OtxIndicatorService {
  private apiKey: string = '';

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  /**
   * Sets the API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Gets information about an IP address
   */
  async getIpInfo(ip: string): Promise<any> {
    try {
      const cacheKey = `ip_${ip}`;
      const cachedData = await otxCacheService.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Using cached data for IP: ${ip}`);
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/indicators/IPv4/${ip}`, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      });
      
      await otxCacheService.saveToCache(cacheKey, response.data);
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
      const cachedData = await otxCacheService.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Using cached data for domain: ${domain}`);
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/indicators/domain/${domain}`, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      });
      
      await otxCacheService.saveToCache(cacheKey, response.data);
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
      const cachedData = await otxCacheService.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log(`Using cached data for file hash: ${hash}`);
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/indicators/file/${hash}`, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      });
      
      await otxCacheService.saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching OTX info for file hash ${hash}:`, error);
      return null;
    }
  }
}

// Export class for composition in the main service
export const indicatorService = new OtxIndicatorService();
