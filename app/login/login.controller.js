'use strict'

angular
	.module('login')
	.controller('LoginController', LoginController);

// $inject ensures that LoginService will still be available when the code is minified.
LoginController.$inject = ['LoginService'];

function LoginController(LoginService) {
	var vm = this;

	vm.attemptLogin = attemptLogin;
	vm.username = LoginService.username;

	/////////////////////

	function attemptLogin(username = vm.username) {
		LoginService.attemptLogin(username);
	}
}