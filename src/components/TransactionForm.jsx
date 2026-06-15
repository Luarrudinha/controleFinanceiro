import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './TransactionForm.css';

const TransactionForm = ({ transaction, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    
    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3>{transaction ? 'Edit Transaction' : 'New Transaction'}</h3>
          <button className="btn-accent" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              className="input-glass"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01"
                className="input-glass"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                className="input-glass"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Type</label>
            <div className="type-toggle">
              <button 
                type="button" 
                className={`toggle-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setFormData({...formData, type: 'expense'})}
              >
                Expense
              </button>
              <button 
                type="button" 
                className={`toggle-btn ${formData.type === 'income' ? 'active income' : ''}`}
                onClick={() => setFormData({...formData, type: 'income'})}
              >
                Income
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            {transaction ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
