console.log('Starting Server');

var port = 2000;

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/client/html/game.html');
});
app.get('/debug', function(req, res) {
  res.sendFile(__dirname + '/client/html/TestPage.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(port);

console.log('Server Started')

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
  console.log('socket connection');
  
  socket.on('chatSend', function(data) {
    console.log(data.message);
    socket.broadcast.emit('chatRecieve', {
      message: data.message
    });
  });
  
});