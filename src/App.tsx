// src/App.tsx
import React from 'react';
import BudgetCalculator from './components/BudgetCalculator';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="app-header">
          <h1>SimpleBudget</h1>
        </header>
        <main className="app-main">
          <BudgetCalculator />
        </main>
        <footer className="app-footer">
          <p>Smart financial planning for everyone</p>
        </footer>
      </div>
    </div>
  );
};

export default App;