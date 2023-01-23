const express = require("express");

const usersController = require("../../controllers/users_controller");


const user_router = express.Router();

user_router.get("/", usersController.getUsers)

user_router.post("/signup", usersController.signup);

user_router.post("/login", usersController.login);

user_router.post("/modif-pwd", usersController.modifyPwd);

module.exports = user_router;
