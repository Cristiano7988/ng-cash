const { verifySignIn, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsername
    ],
    controller.signUp
  );

  app.post(
    "/api/auth/signin",
    [
      verifySignIn.checkUsernameAndPassword
    ]
  );
};
