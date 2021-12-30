const dotenv = require("dotenv");
dotenv.config();
let express = require("express");
let app = express();
let http = require("http").Server(app);
let listenerServer = require("socket.io")(http);
const mongoose = require("mongoose");

let LISTENER_PORT = process.env.LISTENER_PORT || 3000;
const HOST = process.env.HOST;

const listenerService = require("./services/listenerService");
const USER_NAME = process.env.USER_NAME;
const USER_PASSWORD = process.env.USER_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const DB = `mongodb+srv://${USER_NAME}:${USER_PASSWORD}@encrypted-timeseries.nxkbi.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Connection with DB has been established successfully.");
  })
  .catch((err) => {
    console.log("Connect failed to establish", err);
  });

app.use(express.static(__dirname + "/public"));

// Connect listener
listenerServer.on("connection", function (socket) {
  console.log("Client connected");

  socket.on("encrypted_message", async (message) => {
    console.log(message);
    try {
      data = message.toString().slice(0, -1);
      let decryptedData = await listenerService.getDecryptedObject(data);
      let validObject = await listenerService.validateObject(decryptedData);
      if (Object.keys(validObject).length === 3) {
        let dbResponse = await listenerService.saveToDb(validObject);
        listenerServer.emit("data_to_webclient", JSON.stringify(validObject)); //send message to web client
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Disconnect listener
  socket.on("disconnect", function () {
    console.log("Client disconnected.");
  });
});

http.listen(LISTENER_PORT, HOST, function (req, res) {
  console.log(`Server listening on ${HOST}:${LISTENER_PORT}`);
});