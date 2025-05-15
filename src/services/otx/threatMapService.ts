
import { otxCacheService } from './cacheService';
import { pulseService } from './pulseService';

/**
 * Service for generating global threat map data from OTX
 */
export class ThreatMapService {
  private apiKey: string = '';

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
    pulseService.setApiKey(apiKey);
  }

  /**
   * Sets the API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    pulseService.setApiKey(key);
  }

  /**
   * Gets global threat indicators for the map visualization
   */
  async getGlobalThreatMap(): Promise<any> {
    try {
      const cacheKey = 'global_threat_map';
      const cachedData = await otxCacheService.getFromCache(cacheKey);
      
      if (cachedData) {
        console.log('Using cached global threat map data');
        return cachedData;
      }
      
      // Get latest pulses
      const pulses = await pulseService.getPulses(50);
      
      // Process pulses to extract geographic information
      // This is a simplified approach - in a real implementation,
      // we'd need to process the indicators in each pulse to extract
      // geographic information through IP geolocation
      const threatMap = pulseService.processPulsesForMap(pulses);
      
      await otxCacheService.saveToCache(cacheKey, threatMap);
      return threatMap;
    } catch (error) {
      console.error('Error generating global threat map:', error);
      return { regions: [] };
    }
  }
}

// Export class for composition in the main service
export const threatMapService = new ThreatMapService();
