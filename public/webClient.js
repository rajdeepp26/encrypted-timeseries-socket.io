// Make connection
let socket = io.connect("http://localhost:3000");

// Query DOM
let validObject = document.getElementById("valid-object");

// Listen for events
socket.on("data_to_webclient", function (data) {
  var node = document.createElement("p");
  var textnode = document.createTextNode(data);
  node.appendChild(textnode);
  validObject.appendChild(node);

//   console.log(data);
//   validObject.appendChild(data);
});
