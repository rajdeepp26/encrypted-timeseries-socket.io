const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const USER_NAME = process.env.USER_NAME;
const USER_PASSWORD = process.env.USER_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const Database_URL = `mongodb+srv://${USER_NAME}:${USER_PASSWORD}@encrypted-timeseries.nxkbi.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

const databaseConnect = () => {
  mongoose
    .connect(Database_URL, {
      useNewUrlParser: true,
    })
    .then((con) => {
      console.log("Connection with DB has been established successfully.");
    })
    .catch((err) => {
      console.log("Connect failed to establish", err);
    });
};

module.exports = databaseConnect;
