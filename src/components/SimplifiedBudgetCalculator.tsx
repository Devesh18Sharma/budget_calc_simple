import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../types/budgetTypes';
import '../styles/BudgetCalculator.css';

const SimplifiedBudgetCalculator: React.FC = () => {
  // Initial simplified categories based on the image
  const simplifiedCategories: BudgetCategory[] = [
    {
      id: 'housing',
      name: 'Rent/Mortgage',
      type: 'need',
      amount: 0,
      color: '#3949AB',
    },
    {
      id: 'utilities',
      name: 'Utilities + other bills',
      type: 'need',
      amount: 0,
      color: '#E53935',
    },
    {
      id: 'food',
      name: 'Food and groceries',
      type: 'need',
      amount: 0,
      color: '#4FC3F7',
    },
    {
      id: 'debt',
      name: 'Credit cards + other debt',
      type: 'need',
      amount: 0,
      color: '#1976D2',
    },
    {
      id: 'transportation',
      name: 'Transportation',
      type: 'need',
      amount: 0,
      color: '#8BC34A',
    },
    {
      id: 'savings',
      name: 'Save and invest',
      type: 'need',
      amount: 0,
      color: '#1E88E5',
    }
  ];

  const [income, setIncome] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>(simplifiedCategories);
  const [leftToSpend, setLeftToSpend] = useState<number>(0);

  // Handle income change
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setIncome(value);
  };

  // Handle category amount change
  const handleCategoryChange = (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId 
          ? { ...category, amount: value } 
          : category
      )
    );
  };

  // Calculate left to spend
  useEffect(() => {
    const totalExpenses = categories.reduce((sum, category) => sum + category.amount, 0);
    setLeftToSpend(income - totalExpenses);
  }, [income, categories]);

  return (
    <div className="budget-calculator">
      <h2>Simple Budget Calculator</h2>
      
      {/* Income Section */}
      <div className="income-section">
        <div className="input-group">
          <label htmlFor="monthly-income">Monthly Income after taxes</label>
          <div className="input-container">
            <span className="dollar-sign">$</span>
            <input
              id="monthly-income"
              type="number"
              value={income || ''}
              onChange={handleIncomeChange}
              placeholder="0.00"
              className="full-width-input"
            />
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="expenses-section">
        {categories.map((category) => (
          <div key={category.id} className="input-group">
            <label htmlFor={`category-${category.id}`}>{category.name}</label>
            <div className="input-container">
              <span className="dollar-sign">$</span>
              <input
                id={`category-${category.id}`}
                type="number"
                value={category.amount || ''}
                onChange={(e) => handleCategoryChange(category.id, e)}
                placeholder="0.00"
                className="full-width-input"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left to Spend */}
      <div 
        className={`left-to-spend ${leftToSpend < 0 ? 'negative' : ''}`}
      >
        <h3>Left to Spend</h3>
        <p>${leftToSpend.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SimplifiedBudgetCalculator;