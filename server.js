var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);

var messageSeenBy = [];
var usersArray = [];
var sessionTimeouts = {};


app.use("/chat", express.static(__dirname));


server.listen(3000);
console.log('Server listening on port 3000');

var io = require('socket.io')(server);


io.on('connect', function(socket) {
	console.log('User connected.');

	socket.on('login check', function(callback) {
		console.log("Received request to check login status");
		console.log(socket.username);
		callback(socket.username);

		if (socket.username) {
			updateSessionTimeout(socket.username);
		}
	});

	socket.on('logout', function() {
		logout();
	});

	socket.on('message seen', function(username) {
		console.log(username + " has seen the message.");
		messageSeenBy.push(username);
		io.sockets.emit('sending messageSeenBy array', messageSeenBy);
	});

	socket.on('pushUsername', function(username) {
		socket.username = username;
		usersArray.push(username);
		console.log(usersArray);

		updateSessionTimeout(username);

		io.sockets.emit('send user list', usersArray);
	});

	socket.on('request activeUsers', function(callback) {
		callback(usersArray);
	});

	socket.on('requestUsersArray', function(callback) {
		console.log("Sending users array");
		callback(usersArray);
	});

	socket.on('sending message', function(msg) {
		updateSessionTimeout(socket.username);
		messageSeenBy = [];
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
		io.sockets.emit('update typing array', socket.username);
	});

	socket.on('disconnect', function() {
		logout();
		console.log('User disconnected.');
	});

	function createSessionTimeout(username) {
		return setTimeout(function() {
			socket.emit('redirect to login');
			logout();
		}, 1800000);
	}

	function createTimestamp() {
		var date = new Date();

		var day = date.getDate();
		var month = date.getMonth() + 1;
		var hours = ("0" + date.getHours()).slice(-2);
		var minutes = ("0" + date.getMinutes()).slice(-2);

		return day + "/" + month + ", " + hours + ":" + minutes;
	}

	function logout() {
		console.log("Logging out...");
		if (socket.username){
			var index = usersArray.indexOf(socket.username);
			if (index > -1) {
				usersArray.splice(index, 1);
			}
			console.log(usersArray);

			if (sessionTimeouts[socket.username]) {
				clearTimeout(sessionTimeouts[socket.username]);
				delete sessionTimeouts[socket.username];
			}

			index = messageSeenBy.indexOf(socket.username);
			if (index > -1) {
				messageSeenBy.splice(index, 1);
			}
		}

		socket.emit('remove focus event listener');
		io.sockets.emit('sending messageSeenBy array', messageSeenBy);
		io.sockets.emit('send user list', usersArray);
	}

	function updateSessionTimeout(username) {
		console.log("Updating session timeout for " + username);
		if (sessionTimeouts[username]) {
			clearTimeout(sessionTimeouts[username]);
		}
		sessionTimeouts[username] = createSessionTimeout(username);
	}
	
});