const client = require("../connection");
const { Pool } = require("pg");
const pool = new Pool();

exports.postCashOut = (req, res) => {
  const { id } = req.params;
  const { value, username } = req.body;

  pool.connect((error) => {
    const shouldAbort = (error) => {
      if (error) {
        client.query("ROLLBACK", (error) => {
          if (error) return res.send({ message: { content: "Não foi possível realizar o rollback", status: false }, error });
          return res.send({ message: { content: "Não foi possível realizar a transação", status: false }});
        });
      }

      return !!error;
    };

    client.query("BEGIN", (error) => {
      if (shouldAbort(error)) return;

      // Seleciona o usuário que sofrerá o cash in   
      client.query(`select * from users where username = '${username}'`, ((error, user) => {
        if (shouldAbort(error)) return;
        else if (!user.rows.length) {
          return res.send({ message: { content: "Este usuário não se encontra em nosso sistema", status: false }});
        }
        else {
          const [cashIn] = user.rows;

          if (cashIn.account_id === parseInt(id)) return res.send({ message: { content: "A conta informada não deve ser a sua, favor informar uma conta diferente", status: false }});

          // Seleciona o saldo da conta de quem sofrerá o cash out
          client.query(`select balance from accounts where id = ${id}`, (error, cashOutAccount) => {
            if (shouldAbort(error)) return;

            const [cashOutBalance] = cashOutAccount.rows;
            const cashOutAmount = parseFloat(cashOutBalance.balance) - parseFloat(value);

            if (cashOutAmount < 0) return res.send({ message: { content: "Saldo insuficiente", status: false }});
            
            // Realiza o cash out
            client.query(`update accounts set balance = ${parseFloat(cashOutAmount).toFixed(2)} where id = ${id}`, (error) => {
              if (shouldAbort(error)) return;
            });
                
            // Registra o cash out e o cash in na tabela transactions
            client.query(`insert into transactions(value, debited_account_id, credited_account_id) values (${value}, ${id}, ${cashIn.account_id})`, (error, transaction) => {
              if (shouldAbort(error)) return;
            });

            // Seleciona o saldo da conta de quem sofrerá o cash in
            client.query(`select balance from accounts where id = ${cashIn.id}`, (error, cashInAccount) => {
              if (shouldAbort(error)) return;

              const [cashInBalance] = cashInAccount.rows;
              const cashInAmount = parseFloat(cashInBalance.balance) + parseFloat(value);

              // Realiza o cash in
              client.query(`update accounts set balance = ${parseFloat(cashInAmount).toFixed(2)} where id = ${cashIn.account_id}`, (error) => {
              if (shouldAbort(error)) return;

              client.query("COMMIT", (error) => {
                  if (shouldAbort(error)) return;
                  return res.send({ message: { content: "Transação efetuada", status: true }});
                });
              });
            });
          });
        };
      }));
    });
  });
};

exports.transactions = (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const queryDate = date ? `and CAST(transactions.created_at AS DATE) = '${date}'` : '';

  const selectTransactions = `
    select * from transactions
      join users on
        users.account_id = transactions.credited_account_id or
        users.account_id = transactions.debited_account_id
          where
            (transactions.debited_account_id = ${id} or
            transactions.credited_account_id = ${id}) and
            users.account_id != ${id}
            ${queryDate}
  `;

  client.query(selectTransactions, (error, result) => {
    if (error) return res.status(406).send({ message: { content: "Não foi possível acessar as transações", status: false }});
    else if (result.rows.length) {
      const transactions = result.rows.map(transaction => {
        delete transaction.id;
        delete transaction.password;
        delete transaction.account_id;
        return transaction;
      });
      return res.send({ message: { content: "Todas transações", status: true }, transactions });
    }
    else return res.status(406).send({ message: { content: "Não encontramos movimentações nesta data", status: false } });
  })
}

exports.cashIn = (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const queryDate = date ? `and CAST(transactions.created_at AS DATE) = '${date}'` : '';

  const selectTransactions = `
    select * from transactions
      join users on
        users.account_id = transactions.debited_account_id
          where
            transactions.credited_account_id = ${id}
            ${queryDate}
  `;

  client.query(selectTransactions, (error, result) => {
    if (error) return res.status(406).send({ message: { content: "Não foi possível acessar as transações", status: false }});
    else if (result.rows.length) {
      const transactions = result.rows.map(transaction => {
        delete transaction.id;
        delete transaction.password;
        delete transaction.account_id;
        return transaction;
      });  
      return res.send({ message: { content: "Transações do tipo cash in", status: true }, transactions });
    }
    else return res.status(406).send({ message: { content: "Não encontramos movimentações nesta data", status: false } });

  }); 
};

exports.cashOut = (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const queryDate = date ? `and CAST(transactions.created_at AS DATE) = '${date}'` : '';

  const selectTransactions = `
    select * from transactions
      join users on
        users.account_id = transactions.credited_account_id
          where
            transactions.debited_account_id = ${id}
            ${queryDate}
  `;

  client.query(selectTransactions, (error, result) => {
    if (error) return res.status(406).send({ message: { content: "Não foi possível acessar as transações", status: false }});
    else if (result.rows.length) {
      const transactions = result.rows.map(transaction => {
        delete transaction.id;
        delete transaction.password;
        delete transaction.account_id;
        return transaction;
      });
      return res.send({ message: { content: "Transações do tipo cash out", status: true }, transactions });
    }
    else return res.status(406).send({ message: { content: "Não encontramos movimentações nesta data", status: false } });
  });
};
