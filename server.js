var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);

var usersArray = [];


app.use("/chat", express.static(__dirname));


server.listen(3000);
console.log('Server listening on port 3000');

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

	socket.on('logout', function() {
		logout(socket);
	})

	socket.on('sending message', function(msg) {
		var date = createTimestamp();

		io.sockets.emit('new message', {
			'user' : socket.username,
			'body' : msg,
			'timestamp' : date
		});
	});

	socket.on('scroll down', function(callback) {
		callback(true);
	});

	socket.on('user is typing', function() {
		console.log(socket.username + " is typing.");
		io.sockets.emit('update typing array', socket.username);
	});

	socket.on('disconnect', function() {
		logout(socket);

		
		console.log('User disconnected.');
	});

	function createTimestamp() {
		var today = new Date();
		var day = today.getDate();
		var month = today.getMonth()+1;
		var minute = today.getMinutes();
		
		if (minute.length == 1) {
			minute = '0' + minute;
		}
		var hour = today.getHours();

		return day + "/" + month + ", " + hour + ":" + minute;
	}

	function logout(socket) {
		if (socket.username){
			var index = usersArray.indexOf(socket.username);
			if (index > -1) {
				usersArray.splice(index, 1);
			}
			console.log(usersArray);
		}

		io.sockets.emit('send user list', usersArray);
	}

	
});