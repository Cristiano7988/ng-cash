exports.allAccess = (req, res) => {
  res.status(200).send("Livre acesso.");
};

exports.userBoard = (req, res) => {
  res.status(200).send({ message: "Acesso restrito.", status: true });
};
