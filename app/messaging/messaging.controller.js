'use strict'

angular
	.module('messaging')
	.controller('MessagingController', MessagingController);

MessagingController.$inject = ['chatSocket', 'MessagingService', '$scope', '$location'];

function MessagingController(chatSocket, MessagingService, $scope, $location) {
	var vm = this;

	vm.messageStorage = [];

	vm.checkLoginStatus = checkLoginStatus;
	vm.focusTextarea = focusTextarea;
	vm.listenForEnter = listenForEnter;
	vm.sendMessage = sendMessage;
	
	/////////////////////
	
	// Run this when the page loads to ensure users are logged in.
	checkLoginStatus();
	focusTextarea();
	listenForEnter();
	
	chatSocket.emit('request activeUsers', function(activeUsers) {
		vm.activeUsers = activeUsers;
	});

	chatSocket.on('send user list', function(activeUsers) {
		vm.activeUsers = activeUsers;
	});

	chatSocket.on('new message', function(msg) {
		var div = document.getElementById("received-messages");
		var scrollAtBottom = false;
		if (div.scrollTop === (div.scrollHeight - div.offsetHeight)) {
			scrollAtBottom = true;
		}

		vm.messageStorage.push(msg);

		if (scrollAtBottom) {
			scrollDown();
		}
	});


	function checkLoginStatus() {
		var promise = MessagingService.checkLoginStatus();

		promise.then(function(response) {
			if (!response) {
				console.log("You are not logged in!");
				$scope.$apply(function() {
					$location.path('login');
				});
			}
		});
	}

	function focusTextarea() {
		MessagingService.focusTextarea();
	}

	function listenForEnter() {
		document.onkeypress = function(e) {
			if (e.keyCode == 13 && document.activeElement.id == 'message-textarea' && !e.shiftKey) {
				sendMessage($scope.msg);
			}
		}
	}

	function listenForUsers() {
		return MessagingService.listenForUsers();
	}

	// This is triggered by a callback because it needs to happen AFTER the new message has been received from the server.
	// A later alternative might be to use a promise to only trigger this once the new message has been received. (TODO)
	function scrollDown() {
		chatSocket.emit('scroll down', function(callback) {
			var objDiv = document.getElementById("received-messages");
			objDiv.scrollTop = objDiv.scrollHeight;
		});
	}

	function sendMessage(msg) {
		if (msg) {
			console.log("Sending message: " + msg);

			chatSocket.emit('sending message', msg);
			scrollDown();

			$scope.msg = '';
			focusTextarea();				
		}
	}
}