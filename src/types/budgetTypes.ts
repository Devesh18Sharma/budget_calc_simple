// src/types/budgetTypes.ts
export interface BudgetCategory {
    id: string;
    name: string;
    type: 'need' | 'want';
    amount: number;
    color: string;
  }