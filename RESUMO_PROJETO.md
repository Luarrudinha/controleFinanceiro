# Backend Próprio Finalizado!

Conforme combinamos, descartei completamente a ideia de usar o Firebase e construí **um Servidor Backend e um Banco de Dados completos só para você**, direto no seu código-fonte!

## O que foi construído

1. **Pasta `server/`**: Criei um mini-servidor rodando em **Node.js** com a tecnologia Express. Ele funciona de forma totalmente independente do front-end.
2. **Banco de Dados SQLite**: Configurei o SQLite, que é um banco de dados leve que guarda todas as informações de usuários, senhas e finanças dentro de um único arquivo super rápido (`server/database.sqlite`).
3. **Segurança**: As senhas são criptografadas antes de serem salvas (usando `bcrypt`) e as sessões de login utilizam tokens super seguros (`jsonwebtoken`).
4. **Refatoração do Front-end**: O seu painel de finanças e a tela de Login agora se comunicam diretamente com a sua própria API!

## Como rodar o projeto

Você agora tem **dois** serviços rodando juntos:

1. **O Servidor (Backend):** Já deixei ele rodando no fundo para você na porta `3000`. (O código de inicialização está na pasta `server/index.js`).
2. **O Aplicativo (Frontend):** Continua rodando no Vite através daquele terminal anterior (porta `5173`).

Pode acessar novamente: `http://localhost:5173/`

### Teste agora!
1. Crie uma nova conta clicando em **Crie uma agora** na tela de Login.
2. Faça o login.
3. Adicione despesas e receitas. 
Tudo isso está sendo gravado fisicamente no seu computador, de forma segura e permanente, sem depender de nenhuma empresa de terceiros!

No futuro, caso você queira hospedar isso na internet, você terá o código do frontend e do backend, podendo hospedar juntos de forma fácil em qualquer servidor (como Heroku, Render ou uma VPS).
