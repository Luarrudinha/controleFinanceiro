import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="transaction-list-card glass-panel">
      <h3 className="card-title">Transações recentes</h3>
      
      {transactions.length === 0 ? (
        <p className="text-muted empty-state">Nenhuma transação ainda.</p>
      ) : (
        <div className="list-container">
          {transactions.map((t) => (
            <div key={t.id} className="transaction-item">
              <div className="t-info">
                <span className="t-desc">{t.description}</span>
                <span className="t-date">{t.date}</span>
              </div>
              <div className="t-actions">
                <span className={`t-amount ${t.type === 'income' ? 'text-green' : 'text-red'}`}>
                  {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                </span>
                <button className="action-btn" onClick={() => onEdit(t)}>
                  <Edit2 size={16} />
                </button>
                <button className="action-btn text-red" onClick={() => onDelete(t.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
