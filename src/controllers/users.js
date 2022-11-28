exports.userBoard = (req, res) => {
  res.status(200).send({ message: { content: "Usuário verificado", status: true }});
};