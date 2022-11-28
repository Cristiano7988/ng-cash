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
          if (error) return res.send({ message: { content: "Não foi possível realizar o rollback", status: false }, error });
          return res.send({ message: { content: "Não foi possível cadastrar usuário", status: false }});
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
            if (shouldAbort(error)) return;
            return res.send({ message: { content: "Usuário criado", status: true }, user: { username, password } })
          });
        });
      });
    });
  });
};
