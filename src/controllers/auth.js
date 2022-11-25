const client = require("../connection");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const pool = new Pool();

exports.signUp = (req, res) => {
  const { username, password } = req.body;
  
  pool.connect((error, und, done) => {
    const shouldAbort = (error) => {
      if (error) {
        client.query("ROLLBACK", (error) => {
          if (error) console.error("Erro ao executar o rolling back", error.stack);
          done();
        });
      }

      return !!error;
    };

    client.query("BEGIN", (error) => {
      if (shouldAbort(error)) return;

      // Abre a conta
      client.query("insert into accounts(balance) values (100)", (error, account) => {
        if (shouldAbort(error)) return
      });

      // Seleciona conta criada para referenciar no usuário
      client.query("select id from accounts order by id desc limit 1", (error, account) => {
        if (shouldAbort(error)) return;

        const [{ id }] = account.rows;
        const insertUser = `
          insert into users(username, password, account_id)
          values ('${username}', '${bcrypt.hashSync(password, 8)}', ${id})
        `;

        // Cria usuário
        client.query(insertUser, (error, user) => {
          if (shouldAbort(error)) return;

          client.query("COMMIT", (error) => {
            if (error) console.error("Erro ao executar o commit", error.stack);
            res.send({ message: "Usuário criado", user: { username, password }, status: true })
          });
        });
      });
    });
  });
};
