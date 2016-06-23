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
				otherwise('/login');
	}]);