// src/components/BudgetCalculator.tsx
import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../types/budgetTypes';
import DonutChart from './DonutChart';
import '../styles/BudgetCalculator.css';
import swipeLogo from '../assets/swipe-logo.svg';
import { budgetService, syncService } from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch budget data on component mount
  useEffect(() => {
    fetchBudgetData();
    
    // Set up polling for updates
    const updateInterval = setInterval(checkForUpdates, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  // Auto-sync effect - triggers when income or categories change
  useEffect(() => {
    if (!isLoading) {
      const budgetData = budgetService.convertToBudgetData(income, categories);
      syncService.autoSyncBudget(budgetData);
    }
  }, [income, categories, isLoading]);

  const fetchBudgetData = async () => {
    try {
      setIsLoading(true);
      const data = await budgetService.getBudget();
      
      if (data) {
        setIncome(data.income);
        setFormattedInputValues({
          income: data.income ? data.income.toLocaleString() : ''
        });
        
        // Update categories with values from the API
        setCategories(prevCategories => 
          prevCategories.map(category => {
            const amount = Number(data[category.id as keyof typeof data]) || 0;
            setFormattedInputValues(prev => ({
              ...prev,
              [category.id]: amount ? amount.toLocaleString() : ''
            }));
            return {
              ...category,
              amount
            };
          })
        );
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      // Silently fail if user is not logged in or has no data yet
    } finally {
      setIsLoading(false);
    }
  };

  // Check for updates from the server
  const checkForUpdates = async () => {
    try {
      const latestData = await syncService.checkForUpdates();
      if (latestData) {
        // Only update if the data is different to avoid unnecessary re-renders
        if (JSON.stringify(latestData) !== JSON.stringify(budgetService.convertToBudgetData(income, categories))) {
          setIncome(latestData.income);
          setFormattedInputValues({
            income: latestData.income ? latestData.income.toLocaleString() : ''
          });
          
          // Update categories with values from the API
          setCategories(prevCategories => 
            prevCategories.map(category => {
              const amount = Number(latestData[category.id as keyof typeof latestData]) || 0;
              setFormattedInputValues(prev => ({
                ...prev,
                [category.id]: amount ? amount.toLocaleString() : ''
              }));
              return {
                ...category,
                amount
              };
            })
          );
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  // Save budget data to API
  const saveBudgetData = async () => {
    try {
      setIsSaving(true);
      const budgetData = budgetService.convertToBudgetData(income, categories);
      await budgetService.saveBudget(budgetData);
      toast.success('Budget saved successfully!');
    } catch (error: any) {
      console.error('Error saving budget data:', error);
      
      // More specific error handling
      const errorMessage = error.response?.status === 401 
        ? 'You must be logged in to save your budget.' 
        : 'Failed to save budget. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

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
      <ToastContainer position="top-right" autoClose={3000} />
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
      
      {/* Save Budget Button */}
      <div className="save-budget-container">
        <button 
          className="save-budget-button" 
          onClick={saveBudgetData}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Budget'}
        </button>
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