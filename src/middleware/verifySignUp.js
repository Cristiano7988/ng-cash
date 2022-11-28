const client = require("../connection");

const checkDuplicateUsername = (req, res, next) => {
  const { username } = req.body;

  // Busca por usuário com o mesmo username
  client.query(`select * from users where username = '${ username }'`, (error, user) => {
    if (error) return res.send({ message: { content: "Não foi possível verificar se este usuário já existe", status: false }, error });
    else if (user.rows.length) return res.send({ message: { content: "Usuário já cadastrado", status: false } });
    next();
  });
};

const verifySignUp = {
  checkDuplicateUsername
};

module.exports = verifySignUp;
