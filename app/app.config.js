'use strict'

angular.
	module('chatApp').
	config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$locationProvider.hashPrefix('!');

			$routeProvider.
				when('/login', {
					template: '<login></login>'
				}).
				when('/messaging', {
					template: '<messaging></messaging>'
				}).
				otherwise('/login');
	}]);