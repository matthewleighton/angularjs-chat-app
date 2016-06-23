'use strict'

angular
	.module('login')
	.controller('LoginController', LoginController);

LoginController.$inject = ['LoginService'];

function LoginController(LoginService) {
	var vm = this;

	vm.testvar = 5;
	
	vm.username = LoginService.username;
	vm.submitUsername = submitUsername;

	/////////////////////

	function submitUsername(username = vm.username) {
		LoginService.submitUsername(username);

		//console.log(LoginService.username);
	}
}