'use strict'

angular
	.module('core')
	.factory('chatSocket', ['socketFactory', function(socketFactory) {
		return socketFactory();
	}]);