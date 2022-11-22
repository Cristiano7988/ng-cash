const client = require("../connection");

const create = (req, res, next) => {

  // Abre a conta
  client.query("insert into accounts(balance) values (0)", (error, account) => {
    if (error) return res.send({ message: "Não foi possível criar a conta", status: false, error });
    next();
  });
};

const accounts = {
  create
};

module.exports = accounts;
