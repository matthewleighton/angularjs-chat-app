'use strict'

describe('login module', function() {
	
	var loginService;

	beforeEach(angular.mock.module('chatApp'));


	beforeEach(inject(function(_LoginService_) {
		loginService = _LoginService_;
	}));

	describe('login service', function() {

		describe('validateUsernameLength', function() {
			
			it('should return an error for a name fewer than 3 characters', function() {
				var username = 'ab';
				var result = loginService.validateUsernameLength(username).errors;
				
				expect(result).toBeTruthy();
			});

			it('should return an error for a name with more than 12 characters', function() {
				var username = 'abcdefghijklm';
				var result = loginService.validateUsernameLength(username).errors;

				expect(result).toBeTruthy();
			});

			it('should return no error for a name containing 11 characters', function() {
				var username = 'abcdefghijkl';
				var result = loginService.validateUsernameLength(username).errors;

				expect(result).toBeFalsy();
			});
		});

		describe('validateUsernameUniqueness', function() {
			var usersArray = ['Matthew'];

			it('should return an error if the username already exists in the usersArray', function() {
				var username = 'Matthew';
				var result = loginService.validateUsernameUniqueness(username, usersArray).errors;

				expect(result).toBeTruthy();
			});

			it('should return no error if usersArray does not contain the username', function() {
				var username = 'Charlie';
				var result = loginService.validateUsernameUniqueness(username, usersArray).errors;

				expect(result).toBeFalsy();
			});
		});


	});

});