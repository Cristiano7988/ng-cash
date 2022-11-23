const express = require("express");
const cors = require("cors");
const client = require("./connection");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client.connect();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Port: ${PORT}.`);
});

// routes
require('./routes/auth')(app);
require('./routes/user')(app);
require('./routes/users')(app);
require('./routes/accounts')(app);