var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');
var socketIo = require('socket.io');
var bodyParser = require('body-parser');
var _ = require('lodash');

var config = require('./config');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(serveStatic('public/', {'index': ['index.html']}));

var server = http.createServer(app);
var io = socketIo(server);

var clients = [];

io.on('connection', function (socket) {
  clients.push({socket: socket, data: {}});

  clients.forEach(function (c) {
    if (socket !== c.socket) {
      socket.emit('remoteStatusChange', c.data);
    }
  });

  socket.on('statusChange', function (data) {
    console.log('Received status change: ', data);

    clients.forEach(function (c) {
      if (socket !== c.socket) {
        c.socket.emit('remoteStatusChange', data);
      } else {
        _.assign(c.data, data);
      }
    });
  });

  socket.on('tick', function (data) {
    var toUpdate = clients.filter((function (c) {
      return socket === c.socket;
    }))[0];
    _.assign(toUpdate.data, data);
  })
});
server.listen(8000, function () {
  console.log('listening on http://localhost:8000');
});