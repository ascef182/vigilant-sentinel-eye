
import { supabase } from '../supabaseClient';

/**
 * Service for managing realtime subscriptions
 */
export class RealtimeService {
  // Stores realtime subscription callbacks
  private realtimeSubscriptions: { [key: string]: () => void } = {};

  // Subscribes to realtime changes for a given table
  subscribeToTable(table: string, callback: (payload: any) => void): () => void {
    if (!supabase) {
      console.warn('Realtime subscriptions require Supabase connection');
      return () => {};
    }

    try {
      // Create a channel for this table
      const channel = supabase.channel(`public:${table}`);
      
      if (channel) {
        // Subscribe to changes
        // Note: Using 'any' type for now due to type issues with Supabase client
        // The actual implementation supports postgres_changes but TypeScript definitions are incorrect
        const subscription = (channel as any).on(
          'postgres_changes',
          {
            event: '*', 
            schema: 'public', 
            table 
          }, 
          (payload: any) => {
            console.log('Change received!', payload);
            callback(payload);
          }
        );

        if (subscription && subscription.subscribe) {
          subscription.subscribe((status: string) => {
            console.log(`Subscription status for ${table}:`, status);
          });
          
          // Store unsubscribe function
          this.realtimeSubscriptions[table] = () => {
            if (channel) {
              supabase.removeChannel(channel);
            }
          };
        } else {
          console.warn("Subscription object not available");
          this.realtimeSubscriptions[table] = () => {};
        }
      } else {
        console.warn("Channel not available");
        this.realtimeSubscriptions[table] = () => {};
      }
    } catch (error) {
      console.error("Error setting up channel:", error);
      this.realtimeSubscriptions[table] = () => {};
    }
    
    return () => this.unsubscribe(table);
  }

  // Unsubscribes from a specific table
  unsubscribe(table: string): void {
    if (this.realtimeSubscriptions[table]) {
      this.realtimeSubscriptions[table]();
      delete this.realtimeSubscriptions[table];
    }
  }

  // Unsubscribes from all tables
  unsubscribeAll(): void {
    Object.keys(this.realtimeSubscriptions).forEach(table => {
      this.realtimeSubscriptions[table]();
    });
    this.realtimeSubscriptions = {};
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
