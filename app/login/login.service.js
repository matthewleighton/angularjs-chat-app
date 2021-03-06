'use strict'

angular
	.module('login')
	.factory('LoginService', LoginService);

LoginService.$inject = ['chatSocket'];

function LoginService(chatSocket) {
	var service = {
		username : '',

		attemptLogin : attemptLogin,
		formatUsername : formatUsername,
		logout : logout,
		pushUsername : pushUsername,
		validateUsernameLength : validateUsernameLength,
		validateUsernameUniqueness : validateUsernameUniqueness
	}

	return service;
	////////////////////

	function attemptLogin(username) {	
		username = formatUsername(username);

		var promise = new Promise(function(resolve, reject) {
			chatSocket.emit('requestUsersArray', function(response) {
				resolve(response);
			});
		});

		return promise.then(function(usersList) {
			var loginErrors = validateUsername(username, usersList);
			
			if (!loginErrors.errors) {
				pushUsername(username);
			}

			return loginErrors;
		});
	}

	function formatUsername(username) {
		username = username.toLowerCase();
		return username.charAt(0).toUpperCase() + username.slice(1);
	}

	function logout() {
		console.log("Logging out...");
		chatSocket.emit('logout');
		//delete chatSocket.username;
	}

	function pushUsername(username) {
		chatSocket.username = username;
		chatSocket.emit('pushUsername', username);
	}

	function validateUsername(username, usersArray) {
		var lengthValidation = validateUsernameLength(username);

		if (lengthValidation.errors) {
			return lengthValidation;
		}

		return (validateUsernameUniqueness(username, usersArray));
	}

	function validateUsernameLength(username) {
		var minLength = 3;
		var maxLength = 12;

		if (username.length < minLength) {
			return {errors: 'Your username must contain at least ' + minLength + ' characters.'}
		}

		if (username.length > maxLength) {
			return {errors: 'Your username may not contain more than ' + maxLength + ' characters.'}
		}

		return {errors: false}
	}

	function validateUsernameUniqueness(username, usersArray) {
		var uniquenessValidaiton = {};
		uniquenessValidaiton.errors = usersArray.indexOf(username) > -1 ? 'That username is already in use.' : false;

		return uniquenessValidaiton;
	}

}