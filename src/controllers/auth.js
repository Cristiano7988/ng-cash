const client = require("../connection");

exports.signUp = (req, res) => {
  const { username, password } = req.body;

  // Seleciona conta criada para referenciar no usuário
  client.query("select id from accounts order by id desc limit 1", (error, account) => {
    if (error) return res.send({ message: "Não foi possível abrir a conta", status: false, error });
    else if (!account.rows.length) return res.send({ message: "Não foi possível abrir a conta", status: false });

    const [{ id }] = account.rows;
    const insertUser = `
      insert into users(username, password, account_id)
      values ('${username}', '${password}', ${id})
    `;

    // Cria usuário
    client.query(insertUser, (error, user) => {
      if (error) return res.send({ message: "Não foi possível criar o usuário", status: false, error });
      else if (!!user) return res.send({ message: "Usuário criado", status: true });
      else return res.send({ message: "Não foi possível criar o usuário", status: false });
    });
  });
};
