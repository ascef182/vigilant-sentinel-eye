
import { supabase } from '../supabaseClient';
import { USE_REAL_API } from './constants';

/**
 * Service for log file analysis
 */
export class LogAnalysisService {
  // Simulates network delay for mock data
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Simulates log file analysis
  async analyzeLogFile(file: File): Promise<{ threatDetected: boolean; anomalyScore: number; suspiciousEntries?: string[] }> {
    if (USE_REAL_API) {
      try {
        // In a real implementation, this would:
        // 1. Upload the file to Supabase Storage
        // 2. Trigger a serverless function to analyze it
        // 3. Store results in the database
        
        // For now, we'll simulate this flow
        
        // Read file content
        const content = await this.readFileContent(file);
        
        // Simulate analysis by looking for keywords
        const lines = content.split('\n');
        const suspiciousEntries = lines.filter(line => 
          line.toLowerCase().includes('error') || 
          line.toLowerCase().includes('failed') ||
          line.toLowerCase().includes('unauthorized') ||
          line.toLowerCase().includes('denied')
        );
        
        // Calculate an anomaly score based on suspicious entries
        const anomalyScore = Math.min(1, suspiciousEntries.length / 10);
        const threatDetected = anomalyScore > 0.7;
        
        // Store results in Supabase
        const insertResult = await supabase
          .from('processed_logs')
          .insert({
            file_name: file.name,
            suspicious_entries: suspiciousEntries,
            uploaded_at: new Date().toISOString()
          });
          
        if (insertResult.error) throw insertResult.error;
        
        return {
          threatDetected,
          anomalyScore,
          suspiciousEntries: suspiciousEntries.slice(0, 5) // Return top 5 suspicious lines
        };
      } catch (error) {
        console.error("Error analyzing log file:", error);
        throw error;
      }
    } else {
      await this.delay(2000); // Simulating file processing
      
      // Simulate analysis result
      const anomalyScore = Math.random();
      return {
        threatDetected: anomalyScore > 0.7,
        anomalyScore: parseFloat(anomalyScore.toFixed(2))
      };
    }
  }
  
  // Helper method to read file content
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

// Export singleton instance
export const logAnalysisService = new LogAnalysisService();
