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
		var seenByIndex = messageSeenBy.indexOf(username);
		var usersArrayIndex = usersArray.indexOf(username);
		if (seenByIndex < 0 && usersArrayIndex > -1) {
			console.log(username + " has seen the message.");
			messageSeenBy.push(username);
			io.sockets.emit('sending messageSeenBy array', messageSeenBy);
		}
		
	});

	socket.on('pushUsername', function(username) {
		socket.username = username;
		usersArray.push(username);
		console.log(usersArray);

		updateSessionTimeout(username);

		io.sockets.emit('send user list', usersArray);
		announceUser(username, true);
	});

	socket.on('request activeUsers', function(callback) {
		callback(usersArray);
	});

	socket.on('requestUsersArray', function(callback) {
		console.log("Sending users array");
		callback(usersArray);
	});

	socket.on('sending message', function(msg) {
		if (!userExists(socket.username)) {
			return;
		}

		updateSessionTimeout(socket.username);
		messageSeenBy = [];
		var date = createTimestamp();

		var messageObject = {
			'user' : socket.username,
			'body' : msg,
			'timestamp' : date
		}

		sendMessage(messageObject);
	});

	socket.on('scroll down', function(callback) {
		callback(true);
	});

	socket.on('user is typing', function() {
		var index = usersArray.indexOf(socket.username);
		if (index > -1) {
			io.sockets.emit('update typing array', socket.username);	
		}
		
	});

	socket.on('disconnect', function() {
		console.log(socket.username + ' disconnected.');
		logout();
		
	});

	function announceUser(username, loggingIn) {
		var verb = loggingIn ? "joined" : "left";
		var announcement = username + " has " + verb + " the chat.";

		io.sockets.emit('announce user', announcement, username);
	}

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

			announceUser(socket.username, false);
			delete socket.username;
		}

		
		socket.emit('remove focus event listener');
		io.sockets.emit('sending messageSeenBy array', messageSeenBy);
		io.sockets.emit('send user list', usersArray);
	}

	function sendMessage(msg) {
		io.sockets.emit('new message', msg);
	}

	function updateSessionTimeout(username) {
		console.log("Updating session timeout for " + username);
		if (sessionTimeouts[username]) {
			clearTimeout(sessionTimeouts[username]);
		}
		sessionTimeouts[username] = createSessionTimeout(username);
	}

	function userExists(username) {
		var index = usersArray.indexOf(username);
		return (index > -1) ? true : false;
	}
	
});