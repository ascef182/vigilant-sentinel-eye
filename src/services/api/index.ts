
import axios from 'axios';
import { API_BASE_URL } from './constants';
import { realtimeService } from './realtimeService';
import { statusService } from './statusService';
import { alertService } from './alertService';
import { networkService } from './networkService';
import { logAnalysisService } from './logAnalysisService';
import { supabase } from '../supabaseClient';

// Axios instance configured (for future HTTP requests if needed)
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Combine services into a single API service
class ApiService {
  // Realtime subscriptions
  subscribeToTable = realtimeService.subscribeToTable.bind(realtimeService);
  unsubscribe = realtimeService.unsubscribe.bind(realtimeService);
  unsubscribeAll = realtimeService.unsubscribeAll.bind(realtimeService);

  // System status
  getSystemStatus = statusService.getSystemStatus.bind(statusService);
  getSystemHealth = statusService.getSystemHealth.bind(statusService);

  // Alerts
  getActiveAlerts = alertService.getActiveAlerts.bind(alertService);
  analyzeAlert = alertService.analyzeAlert.bind(alertService);

  // Network data
  getAnomalyData = networkService.getAnomalyData.bind(networkService);
  getNetworkTraffic = networkService.getNetworkTraffic.bind(networkService);
  
  // Log analysis
  analyzeLogFile = logAnalysisService.analyzeLogFile.bind(logAnalysisService);
}

// Export a single instance of the service to be used throughout the application
export const apiService = new ApiService();
export { API, supabase };  // Export Axios instance and Supabase client for direct use if needed
