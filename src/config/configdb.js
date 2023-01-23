const mongoose = require("mongoose");

const mongoConnectionURL = "mongodb://localhost:27017";
const databaseName = "prog-res-db";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
};

module.exports = mongoose
    .connect(mongoConnectionURL, options)
    .then(() => console.log("Connection MongoDB établie !!!"))
    .catch((error) => console.log(`Error connecting to MongoDB ${error}`));
