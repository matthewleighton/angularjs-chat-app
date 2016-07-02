'use strict'

angular
	.module('login')
	.controller('LoginController', LoginController);

LoginController.$inject = ['LoginService', 'chatSocket', '$location', '$scope'];

function LoginController(LoginService, chatSocket, $location, $scope) {
	var vm = this;

	vm.attemptLogin = attemptLogin;
	vm.logout = logout;
	vm.error = '';

	logout();
	
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