require("./config/configdb");
const express = require("express");
const morgan = require("morgan");
var body = require('body-parser');
const application = express();
const userRoutes = require("./routes/users_route");

application.use(morgan("dev")).use(express.json());
application.use(body.json());
application.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,Accept,X-Requested-With, Content-Type,Authorization"
  );
  if (request.method === "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return response.status(200).json({});
  }
  next();
});

application.use("/api/users", userRoutes);

module.exports = application;
