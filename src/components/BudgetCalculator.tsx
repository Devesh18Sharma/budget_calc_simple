// src/components/BudgetCalculator.tsx
import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../types/budgetTypes';
import DonutChart from './DonutChart';
import '../styles/BudgetCalculator.css';

const BudgetCalculator: React.FC = () => {
  // Initial categories based on the requirements
  const initialCategories: BudgetCategory[] = [
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
    },
    {
      id: 'online',
      name: 'How much you plan to spend online',
      type: 'want',
      amount: 0,
      color: '#9C27B0',
    }
  ];

  const [income, setIncome] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
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
    <div className="budget-calculator-container">
      <div className="budget-calculator-header">
        <h1>Simple Budget Calculator</h1>
        <p className="subtitle">Plan your monthly budget with ease</p>
      </div>
      
      <div className="budget-calculator-content">
        <div className="input-section">
          {/* Income Section */}
          <div className="income-section">
            <h2>Monthly Income</h2>
            <div className="input-group income-input">
              <label htmlFor="monthly-income">After taxes</label>
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
            <h2>Monthly Expenses</h2>
            {categories.map((category) => (
              <div key={category.id} className="input-group">
                <label htmlFor={`category-${category.id}`}>{category.name}</label>
                <div className="input-container">
                  <span className="color-indicator" style={{ backgroundColor: category.color }}></span>
                  <span className="dollar-sign">$</span>
                  <input
                    id={`category-${category.id}`}
                    type="number"
                    value={category.amount || ''}
                    onChange={(e) => handleCategoryChange(category.id, e)}
                    placeholder="0.00"
                    className="full-width-input"
                    style={{ borderColor: category.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="visualization-section">
          {/* Donut Chart */}
          {income > 0 ? (
            <DonutChart income={income} categories={categories} />
          ) : (
            <div className="empty-chart-placeholder">
              <p>Enter your income to see your budget breakdown</p>
            </div>
          )}
          
          {/* Left to Spend */}
          <div 
            className={`left-to-spend ${leftToSpend < 0 ? 'negative' : ''}`}
          >
            <div className="left-to-spend-content">
              <h3>Left to Spend</h3>
              <p className="amount">${leftToSpend.toFixed(2)}</p>
              <div className="status-indicator">
                {leftToSpend >= 0 ? 'On Budget' : 'Over Budget'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;