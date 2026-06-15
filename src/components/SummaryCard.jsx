import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = income - expense;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="summary-card glass-panel">
      <div className="balance-section">
        <span className="text-muted">Saldo Total</span>
        <h2 className="balance-amount">{formatCurrency(balance)}</h2>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="text-muted">Renda</span>
          <p className="stat-value text-green">{formatCurrency(income)}</p>
        </div>
        <div className="stat-item">
          <span className="text-muted">Despesas</span>
          <p className="stat-value text-red">{formatCurrency(expense)}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
