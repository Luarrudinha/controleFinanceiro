import React, { useState } from 'react';
import './Login.css';

const API_URL = 'http://localhost:3000';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao autenticar');
      }

      if (isLogin) {
        // Salvar token e notificar o App
        localStorage.setItem('finns_token', data.token);
        localStorage.setItem('finns_user', data.email);
        onLoginSuccess(data.email);
      } else {
        // Se cadastrou, muda pra tela de login
        setIsLogin(true);
        setError('Conta criada! Faça login para continuar.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="logo login-logo">
          <div className="logo-icon"></div>
          <span>Finanças</span>
        </div>
        
        <h2 className="login-title">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-muted">
          {isLogin 
            ? 'Acesse suas finanças de qualquer lugar.' 
            : 'Comece a controlar suas finanças hoje mesmo.'}
        </p>

        {error && <div className={`error-message ${error.includes('criada') ? 'success' : ''}`}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-glass" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              className="input-glass" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary submit-btn">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="login-toggle">
          <span className="text-muted">
            {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
          </span>
          <button 
            type="button" 
            className="toggle-link"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Crie uma agora' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
