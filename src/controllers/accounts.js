const client = require("../connection");

exports.balance = (req, res) => {
  const { id } = req.params;

  // Retorna o saldo da conta do usuário
  client.query(`select balance from accounts where id = ${id}`, (error, account) => {
    if (error) return res.status(406).send({ message: { content: "Não foi possível acessar a conta", status: false }, error });
    else if (account.rows.length) return res.send({ message: { content: "Saldo atual", status: true }, account: account.rows[0] });
    else return res.status(404).send({ message: { content: "Não foi possível encontrar a conta", status: false }});
  });
};
