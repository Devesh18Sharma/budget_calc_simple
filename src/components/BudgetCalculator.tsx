// src/components/BudgetCalculator.tsx
import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../types/budgetTypes';
import DonutChart from './DonutChart';
import '../styles/BudgetCalculator.css';
import swipeLogo from '../assets/swipe-logo.svg';

const BudgetCalculator: React.FC = () => {
  // Initial categories with updated colors from Figma
  const initialCategories: BudgetCategory[] = [
    {
      id: 'housing',
      name: 'Housing',
      type: 'need',
      amount: 0,
      color: '#1273CD',
      tooltip: 'What you spend on Rent, Mortgage, HOA Fees'
    },
    {
      id: 'utilities',
      name: 'Utilities + Other Bills',
      type: 'need',
      amount: 0,
      color: '#26A7E1',
      tooltip: 'Water, Gas, Electricity, Internet, Phone, Insurance'
    },
    {
      id: 'food',
      name: 'Food + Personal',
      type: 'need',
      amount: 0,
      color: '#30D5BC',
      tooltip: 'Food, Household Items, Laundry, Pet, Health, Medical'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      type: 'need',
      amount: 0,
      color: '#9AE31B',
      tooltip: 'Car Insurance, Gas, Tolls, Maintenance, Public Transportation'
    },
    {
      id: 'savings',
      name: 'Save + Invest',
      type: 'need',
      amount: 0,
      color: '#EADA2A',
      tooltip: 'Emergency Fund, Investments, Retirement'
    },
    {
      id: 'entertainment',
      name: 'Entertainment + Other',
      type: 'want',
      amount: 0,
      color: '#F4B545',
      tooltip: 'What you spend on fun activities: Travel, Going Out, Subscriptions, Gifts, Beauty, Clothes'
    },
    {
      id: 'debt',
      name: 'Debt Repayments',
      type: 'need',
      amount: 0,
      color: '#FF6550',
      tooltip: 'Loans, Credit Cards, Car Payments'
    }
  ];

  const [income, setIncome] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [leftToSpend, setLeftToSpend] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [formattedInputValues, setFormattedInputValues] = useState<{[key: string]: string}>({});

  // Handle income change
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove commas and non-numeric characters for calculation
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const value = parseInt(rawValue) || 0;
    setIncome(value);
    
    // Format with commas for display
    setFormattedInputValues({
      ...formattedInputValues,
      income: value ? value.toLocaleString() : ''
    });
  };

  // Handle category amount change
  const handleCategoryChange = (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove commas and non-numeric characters for calculation
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const value = parseInt(rawValue) || 0;
    
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId 
          ? { ...category, amount: value } 
          : category
      )
    );
    
    // Format with commas for display
    setFormattedInputValues({
      ...formattedInputValues,
      [categoryId]: value ? value.toLocaleString() : ''
    });
  };

  // Calculate left to spend and total expenses
  useEffect(() => {
    const total = categories.reduce((sum, category) => sum + category.amount, 0);
    setTotalExpenses(total);
    setLeftToSpend(income - total);
  }, [income, categories]);

  // Format currency with commas
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
            {income > 0 && <span className="income-amount">{formatCurrency(income)}</span>}
          </div>
          
          <div className="input-row income-input">
            <label htmlFor="monthly-income">Income after taxes</label>
            <div className="input-container">
              <span className="dollar-sign">$</span>
              <input
                id="monthly-income"
                type="text"
                value={formattedInputValues.income || ''}
                onChange={handleIncomeChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Expenses Section */}
          <div className="expenses-header">
            <h2>Monthly Expenses</h2>
            {totalExpenses > 0 && <span className="expenses-amount">{formatCurrency(totalExpenses)}</span>}
          </div>
          
          {categories.map((category) => (
            <div key={category.id} className="input-row">
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
                  type="text"
                  value={formattedInputValues[category.id] || ''}
                  onChange={(e) => handleCategoryChange(category.id, e)}
                  placeholder="0"
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
          <div className={`available-section ${leftToSpend < 0 ? 'negative-available' : 'positive-available'}`}>
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