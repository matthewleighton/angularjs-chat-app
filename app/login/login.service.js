'use strict'

angular
	.module('login')
	.factory('LoginService', LoginService);

function LoginService() {
	var service = {
		username : '',
		usersArray : [],

		attemptLogin : attemptLogin,
		pushUsername : pushUsername,
		submitUsername : submitUsername,
		validateUsername : validateUsername		
	}

	return service;
	////////////////////

	function attemptLogin(username) {
		console.log("attempting login with username: " + username);
	}

	function pushUsername(username) {
		this.usersArray.push(username);
	}

	function submitUsername(username) {
		return false;
		if (username.length < 3 || username.length > 12) {
			return false;
		} else {
			//return username;
			this.username = username;
		}
	}

	function validateUsername(username) {
		if (username.length < 3 || username.length > 12) {
			return false;
		}

		if (this.usersArray.indexOf(username) > -1) {
			return false;
		}

		return true;
	}
}