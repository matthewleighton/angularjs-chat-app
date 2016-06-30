'use strict'

angular
	.module('messaging')
	.controller('MessagingController', MessagingController);

MessagingController.$inject = ['chatSocket', 'MessagingService', '$scope', '$location'];

function MessagingController(chatSocket, MessagingService, $scope, $location) {
	var vm = this;

	vm.messageStorage = [];

	vm.checkLoginStatus = checkLoginStatus;
	vm.sendMessage = sendMessage;
	
	/////////////////////
	
	// Run this when the page loads to ensure users are logged in.
	checkLoginStatus();
	
	
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

	function listenForUsers() {
		return MessagingService.listenForUsers();
	}

	function sendMessage(msg) {
		if (msg) {
			console.log("Sending message: " + msg);

			chatSocket.emit('sending message', msg);
			scrollDown();

			$scope.msg = '';
				
		}
	}

	function scrollDown() {
		chatSocket.emit('scroll down', function(callback) {
			var objDiv = document.getElementById("received-messages");
			objDiv.scrollTop = objDiv.scrollHeight;
		});
	}


}