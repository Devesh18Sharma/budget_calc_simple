// src/App.tsx
import React from 'react';
import BudgetCalculator from './components/BudgetCalculator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="app-container">
        <BudgetCalculator />
      </div>
    </div>
  );
};

export default App;