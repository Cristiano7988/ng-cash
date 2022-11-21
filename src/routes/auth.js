const { verifySignIn, verifySignUp, accounts } = require("../middleware");
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

  app.post(
    "/api/auth/signin",
    [
      verifySignIn.checkUsernameAndPassword
    ],
    controller.signIn
  );
};
