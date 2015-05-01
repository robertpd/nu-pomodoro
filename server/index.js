var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');
var socketIo = require('socket.io');
var bodyParser = require('body-parser');

var config = require('./config');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(serveStatic('public/', {'index': ['index.html']}));

var server = http.createServer(app);
var io = socketIo(server);

var connections = [];

io.on('connection', function (socket) {
  connections.push({socket: socket, data: {}});

  connections.forEach(function (c) {
    if (socket !== c.socket) {
      socket.emit('action', c.data);
    }
  });

  socket.on('action', function (data) {
    connections.forEach(function (c) {
      if (socket !== c.socket) {
        c.socket.emit('action', data);
      } else {
        c.data = data;
      }
    });
  });
});
server.listen(8000, function () {
  console.log('listening on http://localhost:8000');
});