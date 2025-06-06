
import { supabase } from '../supabaseClient';

type SubscriptionCallback = (payload: any) => void;

/**
 * Service for handling real-time Supabase subscriptions
 */
export class RealtimeService {
  private subscriptions: Map<string, { channel: any; callback: SubscriptionCallback }> = new Map();

  /**
   * Subscribe to changes on a specific table
   */
  subscribeToTable(tableName: string, callback: SubscriptionCallback): string {
    try {
      const subscriptionId = `sub_${Date.now()}`;
      
      // Create a channel with the correct API for postgres_changes
      const channel = supabase
        .channel(subscriptionId)
        .on(
          'postgres_changes' as any,
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: tableName 
          } as any,
          (payload: any) => {
            callback(payload);
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to ${tableName} changes`);
          }
        });
      
      // Store the subscription
      this.subscriptions.set(subscriptionId, {
        channel,
        callback
      });
      
      return subscriptionId;
    } catch (error) {
      console.error(`Failed to subscribe to ${tableName}:`, error);
      // Return a dummy ID that won't be used
      return `failed_${Date.now()}`;
    }
  }

  /**
   * Unsubscribe from a specific subscription
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      // Remove the subscription
      supabase.removeChannel(subscription.channel);
      this.subscriptions.delete(subscriptionId);
      console.log(`Unsubscribed from ${subscriptionId}`);
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription, id) => {
      supabase.removeChannel(subscription.channel);
      console.log(`Unsubscribed from ${id}`);
    });
    this.subscriptions.clear();
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
