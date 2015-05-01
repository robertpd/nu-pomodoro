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

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//setInterval(function () {
//  sio.sockets.emit('time', Date());
//}, 5000);

server.listen(8000, function () {
  console.log('listening on http://localhost:8000');
});