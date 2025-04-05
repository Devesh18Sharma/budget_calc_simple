// src/App.tsx
import React from 'react';
import BudgetCalculator from './components/BudgetCalculator';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <BudgetCalculator />
      </div>
    </div>
  );
};

export default App;