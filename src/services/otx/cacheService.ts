
import { supabase } from '../supabaseClient';

/**
 * Service for handling OTX data caching
 */
export class OtxCacheService {
  /**
   * Saves data to the cache
   */
  async saveToCache(key: string, data: any): Promise<void> {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('otx_cache')
        .insert({
          key,
          data,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
    } catch (e) {
      console.warn('Failed to cache OTX data:', e);
      // If insert failed (possibly due to unique constraint), try update instead
      try {
        // Update existing record
        const { error } = await supabase
          .from('otx_cache')
          .update({
            data,
            created_at: new Date().toISOString()
          })
          .eq('key', key);
          
        if (error) {
          console.error('Failed to update OTX cache:', error);
        }
      } catch (err) {
        console.error('Failed to update OTX cache:', err);
      }
    }
  }

  /**
   * Gets data from the cache
   */
  async getFromCache(key: string): Promise<any | null> {
    if (!supabase) return null;
    
    try {
      const queryResult = await supabase
        .from('otx_cache')
        .select('*')
        .eq('key', key)
        .single();
        
      if (queryResult.error) return null;
      
      const data = queryResult.data;
      if (!data) return null;
      
      // Check if the cache is still valid (less than 1 hour old)
      const createdAt = new Date(data.created_at);
      const now = new Date();
      const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      if (diffHours > 1) {
        console.log(`Cache expired for ${key}`);
        return null;
      }
      
      return data.data;
    } catch (e) {
      console.warn('Failed to retrieve from OTX cache:', e);
      return null;
    }
  }
}

// Export singleton instance
export const otxCacheService = new OtxCacheService();
