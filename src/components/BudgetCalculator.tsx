// src/components/BudgetCalculator.tsx
import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../types/budgetTypes';
import DonutChart from './DonutChart';
import '../styles/BudgetCalculator.css';
import swipeLogo from '../assets/swipe-logo.svg';

const BudgetCalculator: React.FC = () => {
  // Initial categories based on the requirements
  const initialCategories: BudgetCategory[] = [
    {
      id: 'housing',
      name: 'Housing',
      type: 'need',
      amount: 0,
      color: '#3949AB',
      tooltip: 'What you spend on Rent, Mortgage, HOA Fees'
    },
    {
      id: 'utilities',
      name: 'Utilities + Other Bills',
      type: 'need',
      amount: 0,
      color: '#4FC3F7',
      tooltip: 'Water, Gas, Electricity, Internet, Phone, Insurance'
    },
    {
      id: 'food',
      name: 'Food + Personal',
      type: 'need',
      amount: 0,
      color: '#4CAF50',
      tooltip: 'Food, Household Items, Laundry, Pet, Health, Medical'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      type: 'need',
      amount: 0,
      color: '#AFB42B',
      tooltip: 'Car Insurance, Gas, Tolls, Maintenance, Public Transportation'
    },
    {
      id: 'savings',
      name: 'Save + Invest',
      type: 'need',
      amount: 0,
      color: '#FFD54F',
      tooltip: 'Emergency Fund, Investments, Retirement'
    },
    {
      id: 'entertainment',
      name: 'Entertainment + Other',
      type: 'want',
      amount: 0,
      color: '#FF9800',
      tooltip: 'What you spend on fun activities: Travel, Going Out, Subscriptions, Gifts, Beauty, Clothes'
    },
    {
      id: 'debt',
      name: 'Debt Repayment',
      type: 'need',
      amount: 0,
      color: '#F44336',
      tooltip: 'Loans, Credit Cards, Car Payments'
    }
  ];

  const [income, setIncome] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [leftToSpend, setLeftToSpend] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

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

  // Calculate left to spend and total expenses
  useEffect(() => {
    const total = categories.reduce((sum, category) => sum + category.amount, 0);
    setTotalExpenses(total);
    setLeftToSpend(income - total);
  }, [income, categories]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="budget-calculator-container">
      <h2 className="calculator-title">Simple Budget Calculator</h2>
      
      <div className="budget-calculator-content">
        <div className="input-section">
          {/* Income Section */}
          <div className="income-header">
            <h2>Monthly Income</h2>
            <span className="income-amount">{formatCurrency(income)}</span>
          </div>
          
          <div className="input-group income-input">
            <label htmlFor="monthly-income">Income after taxes</label>
            <div className="input-container">
              <span className="dollar-sign">$</span>
              <input
                id="monthly-income"
                type="number"
                value={income || ''}
                onChange={handleIncomeChange}
                placeholder="0"
                className="full-width-input"
              />
            </div>
          </div>

          {/* Expenses Section */}
          <div className="expenses-header">
            <h2>Monthly Expenses</h2>
            <span className="expenses-amount">{formatCurrency(totalExpenses)}</span>
          </div>
          
          {categories.map((category) => (
            <div key={category.id} className="input-group">
              <label htmlFor={`category-${category.id}`}>
                <span className="category-dot" style={{ backgroundColor: category.color }}></span>
                {category.name}
                <div className="tooltip-container">
                  <span className="info-icon">ⓘ</span>
                  <span className="tooltip-text">{category.tooltip}</span>
                </div>
              </label>
              <div className="input-container">
                <span className="dollar-sign">$</span>
                <input
                  id={`category-${category.id}`}
                  type="number"
                  value={category.amount || ''}
                  onChange={(e) => handleCategoryChange(category.id, e)}
                  placeholder="0"
                  className="full-width-input"
                  style={{ borderColor: category.color }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="visualization-section">
          <div className="monthly-overview">
            <h3>Monthly Budget Overview</h3>
          </div>
          
          {/* Donut Chart */}
          {income > 0 ? (
            <DonutChart income={income} categories={categories} totalExpenses={totalExpenses} />
          ) : (
            <div className="empty-chart-placeholder">
              <div className="empty-chart-circle">
                <div className="empty-chart-inner">
                  <h3>Total Spent</h3>
                  <p>$0</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Available Section */}
          <div className="available-section">
            <h3>Available</h3>
            <div className={`available-amount ${leftToSpend < 0 ? 'negative' : ''}`}>
              {formatCurrency(leftToSpend)}
            </div>
            <div className={`budget-status ${leftToSpend < 0 ? 'negative-status' : ''}`}>
              {leftToSpend >= 0 ? 'On Budget' : 'Over Budget'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Swipe Logo */}
      <div className="swipe-logo-container">
        <div className="swipe-logo-text">spend money smarter with</div>
        <img src={swipeLogo} alt="Swipe Swipe" className="swipe-logo" />
      </div>
    </div>
  );
};

export default BudgetCalculator;