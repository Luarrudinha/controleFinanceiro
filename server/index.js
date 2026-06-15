const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const SECRET_KEY = 'super_secret_finns_key_123'; // Em produção isso deve ficar em variável de ambiente (.env)

// Configuração do Ethereal Email (Para testes)
let transporter;
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Falha ao criar conta de teste do Ethereal: ' + err.message);
    return process.exit(1);
  }
  
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
  console.log('Ethereal Email configurado com sucesso para testes!');
});

// Middleware de Autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Rotas de Autenticação
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    db.run(
      'INSERT INTO users (email, password, isVerified, verificationToken) VALUES (?, ?, 0, ?)', 
      [email, hashedPassword, verificationToken], 
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email já cadastrado' });
          }
          return res.status(500).json({ error: 'Erro no banco de dados' });
        }
        
        // Enviar E-mail de confirmação
        const verifyLink = `http://localhost:5173/?verifyToken=${verificationToken}`;
        
        const mailOptions = {
          from: '"Finanças App" <no-reply@financas.com>',
          to: email,
          subject: 'Confirme seu endereço de e-mail',
          text: `Olá!\n\nPor favor, clique no link abaixo para confirmar seu e-mail e ativar sua conta:\n\n${verifyLink}\n\nObrigado!`,
          html: `<p>Olá!</p><p>Por favor, clique no link abaixo para confirmar seu e-mail e ativar sua conta:</p><p><a href="${verifyLink}">${verifyLink}</a></p><p>Obrigado!</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Erro ao enviar e-mail:', error);
          } else {
            console.log('-----------------------------------------');
            console.log('📧 E-mail de confirmação enviado para:', email);
            console.log('🔗 Link de Visualização (Ethereal):', nodemailer.getTestMessageUrl(info));
            console.log('-----------------------------------------');
          }
        });

        res.status(201).json({ message: 'Usuário criado com sucesso. Por favor, verifique seu e-mail.' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.get('/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token ausente' });

  db.get('SELECT * FROM users WHERE verificationToken = ?', [token], (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
    if (!user) return res.status(400).json({ error: 'Token inválido ou expirado' });

    db.run('UPDATE users SET isVerified = 1, verificationToken = NULL WHERE id = ?', [user.id], function(err) {
      if (err) return res.status(500).json({ error: 'Erro ao verificar conta' });
      res.json({ message: 'E-mail confirmado com sucesso!' });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    if (user.isVerified === 0) {
      return res.status(403).json({ error: 'Por favor, verifique seu e-mail na sua caixa de entrada antes de entrar.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
    res.json({ token, email: user.email });
  });
});

// Rotas de Transações (CRUD)
app.get('/transactions', authenticateToken, (req, res) => {
  db.all('SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar transações' });
    res.json(rows);
  });
});

app.post('/transactions', authenticateToken, (req, res) => {
  const { id, description, amount, type, date } = req.body;
  
  db.run(
    'INSERT INTO transactions (id, userId, description, amount, type, date) VALUES (?, ?, ?, ?, ?, ?)',
    [id, req.user.id, description, amount, type, date],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erro ao criar transação' });
      res.status(201).json({ message: 'Transação criada' });
    }
  );
});

app.put('/transactions/:id', authenticateToken, (req, res) => {
  const { description, amount, type, date } = req.body;
  const transId = req.params.id;

  db.run(
    'UPDATE transactions SET description = ?, amount = ?, type = ?, date = ? WHERE id = ? AND userId = ?',
    [description, amount, type, date, transId, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar transação' });
      res.json({ message: 'Transação atualizada' });
    }
  );
});

app.delete('/transactions/:id', authenticateToken, (req, res) => {
  const transId = req.params.id;

  db.run('DELETE FROM transactions WHERE id = ? AND userId = ?', [transId, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao deletar transação' });
    res.json({ message: 'Transação deletada' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
