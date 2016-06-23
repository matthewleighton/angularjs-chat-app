'use strict'

angular
	.module('login')
	.factory('LoginService', LoginService);

function LoginService() {
	var service = {
		username : '',
		usersArray : [],

		pushUsername : pushUsername,
		submitUsername : submitUsername,
		validateUsername : validateUsername		
	}

	return service;
	////////////////////

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

		return true;
	}
}