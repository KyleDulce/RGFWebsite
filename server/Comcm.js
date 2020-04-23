//Communication Channel Manager

var io = require('socket.io')(serv,{});

var Communicate() = function() {
	
	this.ALL_SOCKETS = [];
	this.SOCKET_TO_ID = {};
	
	this.addConnectionListener = function(Socket, Channel, callback) {
		Socket.on(Channel, callback);
	};
	
	this.BroadcastToChannel = function(channel, name, color, message) {
		var data = {
			message: message,
			name: name,
			color: color
		};
		for(x = 0; x < ALL_SOCKETS.length; x++) {
			ALL_SOCKETS[x].emit(channel, data);
		}
	};
	
	this.Open = function(RequestPlayerJoinMethod, PlayerLeaveMethod) {
		io.socket.on("connection", function(socket) {
			ALL_SOCKETS.push(socket);
			
			socket.on("request", function(data) {
				if(data.request == "signIn") {
					
					//get playerid for cookie
					
					socket.emit("requstResponse", {
						response: "accepted",
						session: id
					});
				} else if(data.request == "gameIn") {
					var redata = RequestPlayerJoinMethod(data.sessionId);
					if(!redata.response) {
						socket.emit("requestResponse", {
							response: "denied";
						});
					} else {
						SOCKET_TO_ID[data.sessionId] = socket;
						addConnectionListener(socket, "chatSend", function(data) {
							socket.broadcast.emit('chatRecieve', data);
						});
						socket.emit("requestResponse", {
							response: "accepted",
							redata.data
						});
					}
				} else if(data.request == "gameLeave") {
					PlayerLeaveMethod();
					socket.emit("requestResponse", {
						response: "recieved"
					});
				}
			});
			
			socket.on("disconnect", function() {
				ALL_SOCKETS.splice(ALL_SOCKETS.indexOf(socket),1);
				
			});
		});
	};
}