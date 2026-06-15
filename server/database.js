const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    
    // Criar tabela de usuários
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isVerified INTEGER DEFAULT 0,
        verificationToken TEXT
      )
    `);

    // Tentar adicionar as colunas caso a tabela já exista de uma versão anterior
    db.run("ALTER TABLE users ADD COLUMN isVerified INTEGER DEFAULT 0", (err) => {});
    db.run("ALTER TABLE users ADD COLUMN verificationToken TEXT", (err) => {});

    // Criar tabela de transações
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        userId INTEGER NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);
  }
});

module.exports = db;
