import api from './config';
import { BudgetCategory } from '../types/budgetTypes';

// Interface for budget data
export interface BudgetData {
  userId?: string;
  income: number;
  housing: number;
  utilities: number;
  food: number;
  transportation: number;
  savings: number;
  entertainment: number;
  debt: number;
}

export const budgetService = {
  // Get user's budget
  async getBudget(): Promise<BudgetData> {
    try {
      const response = await api.get('/budget');
      return response.data;
    } catch (error) {
      console.error('Error fetching budget:', error);
      throw error;
    }
  },
  
  // Save or update budget
  async saveBudget(budgetData: Omit<BudgetData, 'userId'>): Promise<BudgetData> {
    try {
      const response = await api.post('/budget', budgetData);
      return response.data;
    } catch (error) {
      console.error('Error saving budget:', error);
      throw error;
    }
  },
  
  // Get budget analysis (comparison of budget vs actual spending)
  async getBudgetAnalysis() {
    try {
      const response = await api.get('/budget/analysis');
      return response.data;
    } catch (error) {
      console.error('Error fetching budget analysis:', error);
      throw error;
    }
  },
  
  // Convert categories array to BudgetData format
  convertToBudgetData(income: number, categories: BudgetCategory[]): Omit<BudgetData, 'userId'> {
    const budgetData = {
      income,
      housing: 0,
      utilities: 0,
      food: 0,
      transportation: 0,
      savings: 0,
      entertainment: 0,
      debt: 0
    };
    
    categories.forEach(category => {
      budgetData[category.id as keyof typeof budgetData] = category.amount;
    });
    
    return budgetData;
  }
};