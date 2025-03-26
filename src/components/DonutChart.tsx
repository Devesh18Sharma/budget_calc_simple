// src/components/DonutChart.tsx
import React from 'react';
import { BudgetCategory } from '../types/budgetTypes';

interface DonutChartProps {
  income: number;
  categories: BudgetCategory[];
}

const DonutChart: React.FC<DonutChartProps> = ({ income, categories }) => {
  // Calculate percentage for each category
  const calculatePercentage = (amount: number) => {
    return income > 0 ? (amount / income) * 100 : 0;
  };

  // Filter out categories with zero amount
  const filteredCategories = categories.filter(cat => cat.amount > 0);
  
  // Calculate total spent and remaining amount
  const totalSpent = filteredCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = income - totalSpent;
  const remainingPercentage = (remaining / income) * 100;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">Budget Breakdown</h2>
      
      <div className="donut-chart">
        <div className="chart-inner">
          <h3>{remaining >= 0 ? 'Remaining' : 'Overspent'}</h3>
          <p>{formatCurrency(remaining)}</p>
          <span className="percentage">{remaining >= 0 ? `${remainingPercentage.toFixed(1)}%` : ''}</span>
        </div>
        
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path 
            className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
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
                  strokeWidth="3.8"
                  strokeDasharray={`${percentage} ${circumference - percentage}`}
                  strokeDashoffset={offset}
                  r="15.9155"
                  cx="18"
                  cy="18"
                />
              );
            }
            return acc;
          }, [] as React.ReactElement[])}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="chart-legend">
        {filteredCategories.map(category => (
          <div key={category.id} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: category.color }}></span>
            <span className="legend-label">{category.name}</span>
            <span className="legend-value">{formatCurrency(category.amount)}</span>
            <span className="legend-percentage">
              {calculatePercentage(category.amount).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
      
      {/* Total */}
      <div className="chart-total">
        <div className="total-label">Total Spent:</div>
        <div className="total-value">{formatCurrency(totalSpent)}</div>
        <div className="total-percentage">
          {((totalSpent / income) * 100).toFixed(1)}% of income
        </div>
      </div>
    </div>
  );
};

export default DonutChart;