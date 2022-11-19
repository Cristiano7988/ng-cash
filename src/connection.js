const { Client } = require('pg');

const client = new Client({
  host: "babar.db.elephantsql.com",
  user: "qerqhech",
  port: 5432,
  password: "ovjaf-q2Y8xp3An0yOs5DsAvxroqeA8O",
  database: "qerqhech"
});

module.exports = client
