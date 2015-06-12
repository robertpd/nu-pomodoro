require("babel/register")({
  stage: 1,
  optional: ['runtime'],
  ignore: /node_modules/
});

var express = require('express');
var http = require('http');
var serveStatic = require('serve-static');
var socketIo = require('socket.io');
var bodyParser = require('body-parser');
var _ = require('lodash');

var config = require('./config');
var ClientPool = require('./ClientPool');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(serveStatic(config.publicPath, {'index': ['index.html']}));

var server = http.createServer(app);
var io = socketIo(server);

var clientPool = new ClientPool({
  heartbeatWithin: 30000,
  onClientRemoved: notifyClientRemoved
});

io.on('connection', function (socket) {
  clientPool.clients.forEach(function (c) {
    if (socket !== c.socket && c.data) {
      socket.emit('remoteStatusChange', c.data);
    }
  });

  socket.on('statusChange', function (data) {
    console.log('statusChange', data);
    console.log('clients', clientPool.size);

    clientPool.clients.forEach(function (c) {
      if (c.id !== data.id) {
        c.socket.emit('remoteStatusChange', data);
      }
    });

    updateClientData(data, socket);
  });

  socket.on('tick', function (data) {
    updateClientData(data, socket);
  });

  socket.on('heartbeat', function (data) {
    updateClientData({
      id: data.client.id,
      user: data.client.user,
      remainingTime: data.pomodoro.remainingTime,
      status: data.pomodoro.status
    }, socket);

    clientPool.heartbeat(data.client.id);
  });

  socket.on('updateSession', function (data) {
    console.log('updateSession', data);

    updateClientData({
      id: data.id,
      user: data.user
    }, socket);

    clientPool.clients.forEach(function (c) {
      if (c.id !== data.id) {
        c.socket.emit('remoteUpdateSession', data);
      }
    });
  });
});

server.listen(config.port, function () {
  console.log('listening on http://localhost:' + config.port);
});

function updateClientData(data, socket) {
  var client = clientPool.get(data.id) || {};

  client.id = data.id;
  client.socket = socket;
  client.data = data;

  clientPool.update(client);
}

function notifyClientRemoved(removedClient) {
  console.log('Removed', removedClient);
  clientPool.clients.forEach(function (c) {
    if (c.id !== removedClient.id) {
      console.log('Notifying', c.id);
      c.socket.emit('remoteClientRemoved', removedClient.data);
    }
  });
}