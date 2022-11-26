const client = require("../connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const config = require("../config/auth");

const checkUsernameAndPassword = (req, res) => {
  const { username } = req.body;

  // Busca por usuário com o mesmo username
  client.query(`select * from users where username = '${ username }'`, (error, { rows }) => {
    if (error) return res.send({ message: { content: "Não foi possível encontrar o usuário", status: false }, error })
    else if (!rows.length) return res.send({ message: { content: "Usuário não encontrado", status: false }})
    const [ user ] = rows;
    
    const validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!validPassword) return res.send({ message: {content: "Senha inválida", status: false }})

    const accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    return res.send({ user: { username, account_id: user.account_id, accessToken }, message: { content: "Usuário logado", status: true }});
  });
};

const verifySignIn = {
  checkUsernameAndPassword
};

module.exports = verifySignIn;
