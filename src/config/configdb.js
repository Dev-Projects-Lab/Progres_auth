const mongoose = require("mongoose");
require("dotenv").config();
const mongoConnectionURL = process.env.DB_URL_CONNECTION;

console.log(process.env.DB_URL_CONNECTION);

const databaseName = process.env.DB_NAME;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: databaseName,
};

module.exports = mongoose
  .connect(mongoConnectionURL, options)
  .then(() => console.log("Connection MongoDB établie !!!"))
  .catch((error) => console.log(`Error connecting to MongoDB ${error}`));
