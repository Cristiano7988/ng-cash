const controller = require("../controllers/users");

module.exports = function (app) {
  app.get(
    "/api/users",
    controller.selectAll
  );
};
