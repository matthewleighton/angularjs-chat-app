'use strict'

describe('login module', function() {
	beforeEach(module('login'));

	var $controller;

	describe('login controller', function() {
	
		beforeEach(inject(function(_$controller_) {
			$controller = _$controller_;
		}));
		
		// Checking that the test system is up and running.
		it('should work', function() {
			console.log($controller);
			expect(true).toEqual(true);
		});

	});

	describe('login service', function() {
		var loginService;

		beforeEach(inject(function(_LoginService_) {
			loginService = _LoginService_;
		}));

		describe('attemptLogin()', function() {
			//it('should ')
		})

		describe('pushUsername()', function() {
			it('should add a username to the usernameArray', function() {
				var username = 'name';
				var numberOfUsers = loginService.usersArray.length;

				loginService.pushUsername(username);
				expect(loginService.usersArray.length).toEqual(numberOfUsers + 1);
			});
		});

		describe('validateUsername()', function() {
			it('should return false for name shorter than 3 characters', function() {
				var username = 'ab';
				expect(loginService.validateUsername(username)).toEqual(false);
			});

			it('should return false for a name longer than 12 characters', function() {
				var username = 'abcdefghijklm';
				expect(loginService.validateUsername(username)).toEqual(false);
			});

			it('should return true for a name containing 3 characters', function() {
				var username = 'abc';
				expect(loginService.validateUsername(username)).toEqual(true);
			});

			it('should return true for a name containing 12 characters', function() {
				var username = 'abcdefghijkl';
				expect(loginService.validateUsername(username)).toEqual(true);
			});

			it('should return false if the username already exists in the usernameArray', function() {
				var username = 'matthew';
				loginService.usersArray = [username];

				expect(loginService.validateUsername(username)).toEqual(false);
			});
		});

		describe('submitUsername()', function() {

		});



	});



});
