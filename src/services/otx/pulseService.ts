
import axios from 'axios';
import { API_ROOT } from './constants';
import { otxCacheService } from './cacheService';

/**
 * Service for fetching and processing OTX Pulses
 */
export class OtxPulseService {
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
   * Gets current pulses (threat intelligence feeds)
   */
  async getPulses(limit: number = 10): Promise<any> {
    try {
      const cacheKey = `pulses_${limit}`;
      const cachedData = await otxCacheService.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log('Using cached OTX pulses data');
        return cachedData;
      }
      
      const response = await axios.get(`${API_ROOT}/pulses/subscribed`, {
        headers: { 'X-OTX-API-KEY': this.apiKey },
        params: { limit }
      });
      
      await otxCacheService.saveToCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching OTX pulses:', error);
      return { results: [] };
    }
  }

  /**
   * Process pulses to extract geographic data for the map
   * This is a mock implementation - in a real scenario, 
   * we'd need to geolocate IPs from the indicators
   */
  processPulsesForMap(pulses: any): any {
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
}

// Export class for composition in the main service
export const pulseService = new OtxPulseService();
