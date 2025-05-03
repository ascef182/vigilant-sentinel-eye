
// VirusTotal API interfaces
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

export interface CachedResult {
  timestamp: string;
  result: VirusTotalResult;
}
