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
		vm.messageStorage.push(msg);
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
		console.log(msg);
		console.log("Sending message");
		chatSocket.emit('sending message', msg);
		$scope.msg = '';
	}


}