'use strict'

angular
	.module('messaging')
	.controller('MessagingController', MessagingController);

MessagingController.$inject = ['chatSocket', 'MessagingService'];

function MessagingController(chatSocket, MessagingService) {
	var vm = this;

	vm.checkLoginStatus = checkLoginStatus;

	chatSocket.emit('login check', function(response) {
		if (response) {
			console.log("You are a logged in user");
		} else {
			console.log("You are not logged not!!!");
		}
	})
	/////////////////////

	function checkLoginStatus() {
		if (!MessagingService.checkLoginStatus()) {
			// Redirect back to login page.
		}
	}
}