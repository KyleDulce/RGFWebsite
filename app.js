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
app.use('/client',express.static(__dirname + '/client'));

serv.listen(port);

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
  console.log('socket connection');
  
  socket.on('test', function(data) {
    console.log('it works');
    console.log(data.message);
    socket.broadcast.emit('chatRecieve', {
      message: data.message
    });
  });
  
  //socket.emit('getS', {
  //  message: "It works"
  //}); 
});