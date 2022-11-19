const client = require("./connection.js");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

client.connect();

// ############# ACCOUNTS #############
// Seleciona todas contas
app.get('/api/accounts', (req, accounts) => {

    client.query('select * from accounts')
    .then(({ rows }) => {
        if (rows.length) accounts.send({ message: 'Contas', status: true, rows })
        else accounts.send({ message: 'Nenhuma conta foi encontrada', status: false })        
    })
    .catch(({ message }) => accounts.send({ message, status: false }))
});

// ############# TRANSACTIONS #############
// Seleciona todas transações
app.get('/api/transactions', (req, transactions) => {

    client.query('select * from transactions')
    .then(({ rows }) => {
        if (rows.length) transactions.send({ message: 'Transações', status: true, rows })
        else transactions.send({ message: 'Nenhuma transação foi encontrada', status: false })
    })
    .catch(({ message }) => transactions.send({ message, status: false }))
});

// Cria transação
app.post('/api/transactions', (req, transaction) => {
    const { creditedAccountId, debitedAccountId, value } = req.body;
    const insertQuery = `
        insert into transactions(credited_account_id, debited_account_id, value)
        values (${creditedAccountId}, ${debitedAccountId}, ${value})
    `;

    client.query(insertQuery)
    .then(() => transaction.send({ message: 'Transação criada', status: true }))
    .catch(({ message }) => transaction.send({ message, status: false }))
});

// ############# USERS #############
// Seleciona todos usuários
app.get('/api/users', (req, users) => {

    client.query('select * from users')
    .then(({ rows }) => {
        if (rows.length) users.send({ message: 'Usuários', status: true, rows })
        else users.send({ message: 'Nenhum usuário foi encontrado', status: false })
    })
    .catch(({ message }) => users.send({ message, status: false }))
});

// Cria usuário
app.post('/api/users', (req, user) => {
    const { username, password } = req.body;

    // Verifica se usuário já existe
    client.query(`select * from users where username = '${username}'`)
    .catch(({ message }) => user.send({ message, status: false }))

    // Abre a conta
    client.query('insert into accounts(balance) values (0)')
    .catch(({ message }) => user.send({ message, status: false }));

    // Cria usuário referenciando a conta criada
    client.query('select id from accounts order by id desc limit 1')
    .then(({ rows }) => {
        if (!rows.length) user.send({ message: 'Não foi possível abrir a conta', status: false })
        
        const [{ id }] = rows
        const insertUser = `
            insert into users(username, password, account_id)
            values ('${username}', '${password}', ${id})
        `;

        client.query(insertUser)
        .then(() => user.send({ message: 'Usuário criado', status: true }))
        .catch(({ message }) => user.send({ message, status: false }))
    })
    .catch(({ message }) => user.send({ message, status: false }))
});
