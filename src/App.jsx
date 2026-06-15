import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import BackgroundGlow from './components/BackgroundGlow';
import SummaryCard from './components/SummaryCard';
import TransactionsChart from './components/TransactionsChart';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Login from './components/Login';
import { PlusCircle, LogOut } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('finns_user'));
  const [token, setToken] = useState(localStorage.getItem('finns_token'));
  const [transactions, setTransactions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        if (res.status === 401 || res.status === 403) handleLogout();
      }
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
    }
  };

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setToken(localStorage.getItem('finns_token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('finns_token');
    localStorage.removeItem('finns_user');
    setToken(null);
    setUserEmail(null);
  };

  const handleAddTransaction = async (newTransaction) => {
    const t = { ...newTransaction, id: uuidv4() };
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(t)
      });
      
      if (res.ok) {
        setTransactions([t, ...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)));
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTransaction)
      });
      
      if (res.ok) {
        const updatedList = transactions.map((t) => t.id === updatedTransaction.id ? updatedTransaction : t);
        setTransactions(updatedList.sort((a,b) => new Date(b.date) - new Date(a.date)));
        setEditingTransaction(null);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar transação: ", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar transação: ", error);
    }
  };

  const openEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  if (!token) {
    return (
      <>
        <BackgroundGlow />
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <>
      <BackgroundGlow />
      
      <div className="app-container">
        <header className="header glass-panel">
          <div className="logo">
            <div className="logo-icon"></div>
            <span>Finanças</span>
          </div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Sobre</a>
            <a href="#">Serviço</a>
          </nav>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{userEmail}</span>
            <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
              <PlusCircle size={18} />
              Adicionar
            </button>
            <button className="action-btn text-red" onClick={handleLogout} title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="main-content">
          <section className="hero">
            <h1 className="heading-lg">
              Assuma o controle <br />
              <span className="text-gradient">de suas finanças</span>
            </h1>
            <p className="text-muted">
              Seus dados agora estão salvos de forma segura em seu próprio servidor.
            </p>
          </section>

          <section className="dashboard-grid">
            <div className="grid-center">
              <SummaryCard transactions={transactions} />
            </div>
            
            <div className="grid-left">
               <TransactionsChart transactions={transactions} />
            </div>

            <div className="grid-right">
               <TransactionList 
                  transactions={transactions} 
                  onEdit={openEdit} 
                  onDelete={handleDeleteTransaction} 
               />
            </div>
          </section>
        </main>
      </div>

      {isFormOpen && (
        <TransactionForm 
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
}

export default App;
