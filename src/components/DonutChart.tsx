// src/components/DonutChart.tsx
import React from 'react';
import { BudgetCategory } from '../types/budgetTypes';

interface DonutChartProps {
  income: number;
  categories: BudgetCategory[];
  totalExpenses: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ income, categories, totalExpenses }) => {
  // Calculate percentage for each category
  const calculatePercentage = (amount: number) => {
    return income > 0 ? (amount / income) * 100 : 0;
  };
  
  // Filter out categories with zero amount
  const filteredCategories = categories.filter(cat => cat.amount > 0);
  
  // Calculate percentage of income spent
  const percentageSpent = income > 0 ? (totalExpenses / income) * 100 : 0;
  
  // Format currency with commas
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate remaining percentage
  const remainingPercentage = income > 0 ? 100 - percentageSpent : 0;

  return (
    <div className="chart-container">
      <div className="donut-chart">
        <div className="chart-inner">
          <h3>Total Spent</h3>
          <p>{formatCurrency(totalExpenses)}</p>
          {income > 0 && (
            <span className="percentage">{percentageSpent.toFixed(1)}% of income</span>
          )}
        </div>
        
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            strokeWidth="3.2"
          />
          
          {/* Remaining balance segment with light gray color */}
          {remainingPercentage > 0 && (
            <circle
              className="circle remaining"
              stroke="#E8E8E8"
              strokeWidth="3.2"
              strokeDasharray={`${remainingPercentage} ${100 - remainingPercentage}`}
              strokeDashoffset="0"
              r="15.9155"
              cx="18"
              cy="18"
              strokeLinecap="butt"
            />
          )}
          
          {filteredCategories.reduce((acc, category, index, arr) => {
            // Calculate all previous percentages combined
            const previousPercentages = arr
              .slice(0, index)
              .reduce((sum, cat) => sum + calculatePercentage(cat.amount), 0);
              
            const percentage = calculatePercentage(category.amount);
            if (percentage > 0) {
              // Calculate stroke-dasharray and stroke-dashoffset
              const circumference = 100;
              const offset = circumference - previousPercentages;
              acc.push(
                <circle
                  key={category.id}
                  className="circle"
                  stroke={category.color}
                  strokeWidth="3.2"
                  strokeDasharray={`${percentage} ${circumference - percentage}`}
                  strokeDashoffset={offset}
                  r="15.9155"
                  cx="18"
                  cy="18"
                  strokeLinecap="butt"
                />
              );
            }
            return acc;
          }, [] as React.ReactElement[])}
        </svg>
      </div>
    </div>
  );
};

export default DonutChart;