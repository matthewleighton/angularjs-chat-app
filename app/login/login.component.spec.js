'use strict'

describe('login module', function() {
	beforeEach(module('login'));

	var $controller;

	describe('login controller', function() {
	
		beforeEach(inject(function(_$controller_) {
			$controller = _$controller_;
		}));


		/*
		beforeEach(inject(function($componentController) {
			ctrl = $componentController(login)
		}));
		*/
		
		// Checking that the test system is up and running.
		it('should work', function() {
			console.log($controller);
			expect(true).toEqual(true);
		});
/*
		it('should return false if a username is fewer than 3 characters', function() {
			var username = 'ab';
			var controller = $controller('LoginController', {});
			//controller.username = username;
			expect(controller.submitUsername(username)).toEqual(false);
		});
*/
	});

	describe('login service', function() {
		var loginService;

		beforeEach(inject(function(_LoginService_) {
			loginService = _LoginService_;
		}));

		describe('validateUsername', function() {
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
		});

	});



});
