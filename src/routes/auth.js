const verifySignUp = require("../middleware/verifySignUp");
const accounts = require("../middleware/accounts");
const controller = require("../controllers/auth");
const verifySignIn = require("../middleware/verifySignIn");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsername,
      accounts.create
    ],
    controller.signUp
  );

  app.post(
    "/api/auth/signin",
    [
      verifySignIn.checkUsernameAndPassword
    ],
    controller.signIn
  );
};
