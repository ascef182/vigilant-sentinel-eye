
import { VirusTotalResult } from '@/types/virusTotal';

/**
 * Helper function to calculate threat score from VirusTotal results
 */
export function calculateThreatScore(result: VirusTotalResult): number {
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
