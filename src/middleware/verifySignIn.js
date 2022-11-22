const client = require("../connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const config = require("../config/auth");

const checkUsernameAndPassword = (req, res) => {
  const { username } = req.body;

  // Busca por usuário com o mesmo username
  client.query(`select * from users where username = '${ username }'`, (error, { rows }) => {
    if (error) return res.send({ message: "Não foi possível encontrar o usuário", status: false, error, accessToken: null, })
    else if (!rows.length) return res.send({ message: "Usuário não encontrado", status: false, accessToken: null })
    const [ user ] = rows;
    
    const validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!validPassword) return res.send({ message: "Senha inválida", status: false, accessToken: null, })

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    return res.send({ user, accessToken: token });
  });
};

const verifySignIn = {
  checkUsernameAndPassword
};

module.exports = verifySignIn;
