const { WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;
const url = require("url");
const express = require('express');
const bodyParser = require('body-parser');

//Creating the websocket which will communicate with the React front-end
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const port = 8000;
const connections = {};
const users = {};

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;
  broadcast();

  console.log(
    `${user.username} updated their updated state: ${JSON.stringify(
      user.state,
    )}`,
  );
};

const handleClose = (uuid) => {
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];
  broadcast();
};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message)
  });
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  console.log(`${username} connected`);
  const uuid = uuidv4();
  connections[uuid] = connection;
  users[uuid] = {
    username,
    state: {},
  };
  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// Creating the express api which will receive webhooks from IFTTT and send them as messages to the websockets client
const app = express();
app.use(bodyParser.json());

const PORT = 8080;

app.post('/hook', (req, res) => {
    console.log(req.body);

    wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(req.body));
    })

    res.status(200).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
