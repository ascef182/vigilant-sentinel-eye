
import { supabase } from './supabaseClient';

/**
 * Helper for caching VirusTotal API responses to minimize API usage
 */
export async function getFromCacheOrApi<T>(
  cacheKey: string, 
  apiFn: () => Promise<T>,
  cacheExpirationHours = 24
): Promise<T> {
  try {
    // Check if we have a cached result
    const { data } = await supabase
      .from('virustotal_cache')
      .select('*')
      .eq('key', cacheKey)
      .single();

    if (data) {
      const cachedData = data as unknown as { key: string, result: T, timestamp: string };
      const cacheTime = new Date(cachedData.timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);

      // Return cached data if it's not expired
      if (hoursDiff < cacheExpirationHours) {
        console.log('Using cached VirusTotal data for:', cacheKey);
        return cachedData.result;
      }
    }

    // If no cached data or expired, call the API
    const result = await apiFn();
    
    // Update cache
    await supabase
      .from('virustotal_cache')
      .upsert({ 
        key: cacheKey, 
        result, 
        timestamp: new Date().toISOString() 
      }, { onConflict: 'key' });

    return result;
  } catch (error) {
    console.error('Cache/API error:', error);
    // If cache fails, still try the API directly
    return apiFn();
  }
}
