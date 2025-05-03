
// OTX API Types

export interface OtxPulse {
  id: string;
  name: string;
  description: string;
  author_name: string;
  modified: string;
  created: string;
  tags: string[];
  targeted_countries: string[];
  adversary: string;
  tlp: string;
  references: string[];
}

export interface OtxPulseInfo {
  count: number;
  pulses: OtxPulse[];
}

export interface OtxIpResponse {
  reputation: number;
  country_code: string;
  country_name: string;
  asn: string;
  city_data: boolean;
  continent_code: string;
  latitude: number;
  longitude: number;
  pulse_info: OtxPulseInfo;
}

export interface OtxDomainResponse {
  pulse_info: OtxPulseInfo;
  whois: string;
  reputation: number;
  category: string[];
}

export interface OtxFileResponse {
  pulse_info: OtxPulseInfo;
  analysis: {
    info: {
      file_type: string;
      file_size: number;
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
}

export interface OtxThreatMapRegion {
  id: string;
  name: string;
  count: number;
}

export interface OtxThreatMap {
  regions: OtxThreatMapRegion[];
}

export interface OtxCache {
  key: string;
  data: any;
  created_at: string;
}
