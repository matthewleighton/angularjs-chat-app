var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);

var usersArray = ['Steve', 'Tom'];


app.use(express.static(__dirname));

server.listen(3001);
console.log('Server listening on port 3001');

var io = require('socket.io')(server);


io.on('connect', function(socket) {
	console.log('User connected.');

	socket.on('requestUsersArray', function(callback) {
		console.log("Sending users array");
		callback(usersArray);
	});

	socket.on('pushUsername', function(username) {
		socket.username = username;
		usersArray.push(username);
		console.log(usersArray);

		io.sockets.emit('send user list', usersArray);
	});

	socket.on('login check', function(callback) {
		console.log("Received request to check login status");
		console.log(socket.username);
		callback(socket.username);
	});

	socket.on('request activeUsers', function(callback) {
		callback(usersArray);
	});

	socket.on('sending message', function(msg) {
		console.log(msg);
		io.sockets.emit('new message', {
			'user' : socket.username,
			'body' : msg,
			'timestamp' : Date.now()
		});
	});

	socket.on('disconnect', function() {
		if (socket.username){
			var index = usersArray.indexOf(socket.username);
			if (index > -1) {
				usersArray.splice(index, 1);
			}
			console.log(usersArray);
		}

		io.sockets.emit('send user list', usersArray);
		console.log('User disconnected.');
	});

	
});