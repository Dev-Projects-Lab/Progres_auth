
require("./src/config/configdb")
const express = require('express')
const morgan = require('morgan')
const HttpError = require("./models/http-error");
const application = express()

const port = 8080
const userRoutes = require("./src/route/users_route")

application.use(morgan("dev")).use(express.json());

application.use((request,response,next) => {	
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Origin,Accept,X-Requested-With, Content-Type,Authorization");
	if (request.method === "OPTIONS") {
		response.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
		return response.status(200).json({})
	}
	next()
});


application.use("/api/users", userRoutes);

application.listen(port, () =>
	console.log(`\n ==> Serveur demarrée sur l'url : http://localhost:${port} 😋😋😋😋😋😋  !!!\n`)
);