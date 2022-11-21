const verifySignUp = require("../middleware/verifySignUp");
const accounts = require("../middleware/accounts");
const controller = require("../controllers/auth");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsername,
      accounts.create
    ],
    controller.signUp
  );
};
