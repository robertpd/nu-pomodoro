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

app.use(serveStatic(config.publicPath, {'index': ['index.html']}));

var server = http.createServer(app);
var io = socketIo(server);

var clients = [];

io.on('connection', function (socket) {
  clients.forEach(function (c) {
    if (socket !== c.socket && c.data) {
      socket.emit('remoteStatusChange', c.data);
    }
  });

  socket.on('statusChange', function (data) {
    console.log('statusChange', data);
    clients.forEach(function (c) {
      if (c.clientId !== data.clientId) {
        c.socket.emit('remoteStatusChange', data);
      }
    });

    updateClientData(data, socket);
  });

  socket.on('tick', function (data) {
    updateClientData(data, socket);
  })
});

server.listen(config.por, function () {
  console.log('listening on ' + config.url);
});

function updateClientData(data, socket) {
  var client = _.find(clients, {clientId: data.clientId});
  if (!client) {
    console.log('Adding client ' + data.clientId);
    client = { clientId: data.clientId };
    clients.push(client);
  }

  client.socket = socket;
  client.data = data;
}
