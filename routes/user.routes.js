
module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/register", users.register);
    router.post("/login", users.login)
    // Create a new Tutorial
    app.use("/api/users", router);
  };
  