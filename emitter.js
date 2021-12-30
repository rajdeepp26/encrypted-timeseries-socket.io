const dotenv = require("dotenv");
dotenv.config();
let express = require("express");
let app = express();
let http = require("http").Server(app);
let emitterServer = require("socket.io")(http);
const { readFileSync } = require("fs");

const emitterService = require("./services/emitterService");
const filename = "./data.json";
let fileObject = readFileSync(filename, "utf8");

let EMITTER_PORT = process.env.EMITTER_PORT || 2000;
const HOST = process.env.HOST;
const TIME_INTERVAL = 3000;

let client = require("socket.io-client");
let listenerService = client.connect(
  `http://localhost:${process.env.LISTENER_PORT}`,
  {
    reconnect: true,
  }
);

// Connect listener
emitterServer.on("connection", function (socket) {
  console.log("Client connected to emitter");

  // Disconnect listener
  socket.on("disconnect", function () {
    console.log("Client disconnected from emitter");
  });
});

listenerService.on("connect", function () {
  console.log("Connected to listener service");
  console.log(`Emitting data to ${HOST}:${process.env.LISTENER_PORT}...`);
  let Emitter = setInterval(() => {
    let transformedObject = emitterService.createObjectFromFile(fileObject);
    let transformedObjectWithHash =
      emitterService.addHashToObject(transformedObject);
    let encryptedMessage = emitterService.encryptObject(
      transformedObjectWithHash
    );
    listenerService.emit("encrypted_message", encryptedMessage + "|");
  }, TIME_INTERVAL);
});

listenerService.on("disconnect", function () {
  console.log("Listener disconnected.");
});

http.listen(EMITTER_PORT, HOST, function (req, res) {
  console.log(`Server listening on ${HOST}:${EMITTER_PORT}`);
});
