var http = require('http');
var express = require('express');
var cors = require('cors');
var jwt = require('express-jwt');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var app = express();

var authenticate = jwt({
  secret: new Buffer('QTHrJJFbirE2x9kDYnMyCnINKBn_kOeKtTRfCfdyWnDCNfcZ-5QWOiXgWVbmokZL', 'base64'),
  audience: '7XpPWvhohMHlLgjoNS8GMAmgd6mByIE9'
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/secured', authenticate);
app.use(cors());

app.use(serveStatic('public/', {'index': ['index.html']}));

app.route('/ping')
  .get(function (req, res) {
    res.send(200, {text: "All good. You don't need to be authenticated to call this"});
  });

app.route('/secured/ping')
  .get(function (req, res) {
    res.send(200, {text: "All good. You only get this message if you're authenticated"});
  });

var port = 8000;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});


//
//
//var express = require('express');
//var http = require('http');
//var serveStatic = require('serve-static');
//
//var socketIo = require('socket.io');
//var socketioJwt = require('socketio-jwt');
//
//var jwt = require('jsonwebtoken');
//
//var bodyParser = require('body-parser');
//
//var config = require('./config');
//var app = express();
//
//app.use(bodyParser.urlencoded({
//  extended: true
//}));
//app.use(bodyParser.json());
//
//
//app.use(serveStatic('public/', {'index': ['index.html']}));
//
//app.route('/login')
//  .post(function (req, res) {
//    var profile = {
//      first_name: 'John',
//      last_name: 'Doe',
//      email: 'john@doe.com',
//      id: 123
//    };
//
//    var token = jwt.sign(profile, config.jwtSecret, { expiresInMinutes: 60 * 5 });
//
//    res.json({token: token});
//  });
//
//var server = http.createServer(app);
//var sio = socketIo.listen(server);
//
//sio.use(socketioJwt.authorize({
//  secret: config.jwtSecret,
//  handshake: true
//}));
//
//sio.sockets
//  .on('connection', function (socket) {
//    console.log(socket.decoded_token.email, 'connected');
//    socket.on('ping', function (m) {
//      socket.emit('pong', m);
//    });
//  });
//
//setInterval(function () {
//  sio.sockets.emit('time', Date());
//}, 5000);
//
//server.listen(8000, function () {
//  console.log('listening on http://localhost:8000');
//});