'use strict'

angular
	.module('login')
	.controller('LoginController', LoginController);

LoginController.$inject = ['LoginService', 'MessagingService', 'chatSocket', '$location', '$scope'];

function LoginController(LoginService, MessagingService, chatSocket, $location, $scope) {
	var vm = this;

	vm.attemptLogin = attemptLogin;
	vm.logout = logout;
	vm.error = '';


	logout();
	// Timeout needed in order to allow final emits to be received from server before we stop listening for them.
	
	/*setTimeout(function() {
		chatSocket.removeAllListeners();
		document.onkeydown = null;
	}, 0);*/
	
	
	/////////////////////

	function attemptLogin(username = '') {
		var promise = LoginService.attemptLogin(username);

		promise.then(function(loginErrors) {
			var error = loginErrors.errors;
			$scope.$apply(function() {
				if (error) {
					vm.error = error;
				} else {
					$location.path('messaging');
				}
			});
		});
	}

	function logout() {
		LoginService.logout();
	}
}