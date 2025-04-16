import api from './config';
import { BudgetData } from './budgetService';

// Throttle time in milliseconds
const THROTTLE_TIME = 3000;

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
let lastSyncedData: BudgetData | null = null;

export const syncService = {
  /**
   * Automatically sync budget data to the backend with throttling
   * This prevents too many API calls if the user is rapidly changing values
   */
  autoSyncBudget(budgetData: BudgetData): void {
    // Don't sync if data hasn't changed
    if (JSON.stringify(budgetData) === JSON.stringify(lastSyncedData)) {
      return;
    }

    // Save current data for comparison
    lastSyncedData = { ...budgetData };

    // Clear existing timeout if any
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    // Set new timeout for throttled sync
    syncTimeout = setTimeout(async () => {
      try {
        const response = await api.post('/budget/auto-sync', budgetData);
        console.log('Auto-sync successful:', response.data);
        // No toast notification for auto-sync to avoid UI clutter
      } catch (error) {
        console.error('Auto-sync failed:', error);
        // Silent fail for auto-sync - we don't want to show errors for background operations
      }
    }, THROTTLE_TIME);
  },

  /**
   * Check if there's any unsaved data on the server that needs to be pulled
   */
  async checkForUpdates(): Promise<BudgetData | null> {
    try {
      const response = await api.get('/budget/latest');
      return response.data;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }
}; 