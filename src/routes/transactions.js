const { authJwt } = require("../middleware");
const controller = require("../controllers/transactions");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/accounts/:id/transactions/cash-out",
    [authJwt.verifyToken],
    controller.cashOut
  );

  app.get(
    "/api/transactions/:id",
    [authJwt.verifyToken],
    controller.transactions
  );
};