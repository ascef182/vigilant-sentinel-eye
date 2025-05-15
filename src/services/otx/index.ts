
import { DEFAULT_API_KEY } from './constants';
import { pulseService } from './pulseService';
import { indicatorService } from './indicatorService';
import { threatMapService } from './threatMapService';

/**
 * Main OTX API Service for threat intelligence
 */
class OtxService {
  private apiKey: string = '';
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OTX_API_KEY || DEFAULT_API_KEY;
    
    // Set the API key in all component services
    pulseService.setApiKey(this.apiKey);
    indicatorService.setApiKey(this.apiKey);
    threatMapService.setApiKey(this.apiKey);
  }

  /**
   * Sets the API key for OTX
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    
    // Update all component services
    pulseService.setApiKey(key);
    indicatorService.setApiKey(key);
    threatMapService.setApiKey(key);
  }

  // Expose methods from component services
  getPulses = pulseService.getPulses.bind(pulseService);
  getIpInfo = indicatorService.getIpInfo.bind(indicatorService);
  getDomainInfo = indicatorService.getDomainInfo.bind(indicatorService);
  getFileInfo = indicatorService.getFileInfo.bind(indicatorService);
  getGlobalThreatMap = threatMapService.getGlobalThreatMap.bind(threatMapService);
}

// Export singleton instance
export const otxService = new OtxService();
