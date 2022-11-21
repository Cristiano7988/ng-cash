const client = require("../connection");

exports.selectAll = (req, res) => {

  // Seleciona todos usuários
  client.query("select * from users", (error, users) => {
    if (error) return res.send({ message: "Não foi possível buscar os usuários", status: false, error });
    else if (users.rows.length) return res.send({ message: "Usuários", status: true, rows: users.rows });
    else return res.send({ message: "Nenhum usuário foi encontrado", status: false });
  });
};
