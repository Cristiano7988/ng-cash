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

  app.get(
    "/api/transactions/:id",
    [authJwt.verifyToken],
    controller.transactions
  );

  app.get(
    "/api/transactions/:id/cash-in",
    [authJwt.verifyToken],
    controller.cashIn
  );

  app.get(
    "/api/transactions/:id/cash-out",
    [authJwt.verifyToken],
    controller.cashOut
  );

  app.post(
    "/api/transactions/:id/cash-out",
    [authJwt.verifyToken],
    controller.postCashOut
  );
};