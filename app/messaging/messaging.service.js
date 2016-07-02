'use strict'

angular
	.module('messaging')
	.factory('MessagingService', MessagingService);

MessagingService.$inject = ['chatSocket'];

function MessagingService(chatSocket) {
	var service = {
		checkLoginStatus : checkLoginStatus,
		focusTextarea : focusTextarea,
		insertAnchorTags : insertAnchorTags,
		listenForUsers : listenForUsers
	}

	return service;
	////////////////////

	function checkLoginStatus() {
		return new Promise(function(resolve, reject) {
			chatSocket.emit('login check', function(response) {
				resolve(response);
			});
		});
	}

	function focusTextarea() {
		document.getElementById('message-textarea').focus();
	}

	function insertAnchorTags(msg) {
		//var reg = /\b((https?:\/\/www\.)|(https?:\/\/)|(www\.))(\w+\.[a-z.]+)(\S+)?/gi;
		var reg = /\b((https?:\/\/www\.)|(https?:\/\/)|(www\.))(\w+\.[a-z.]+)([^ ,\n]*)/gi;


		var result;
		var minIndex = 0;
		while (result = reg.exec(msg)) {
			if (result['index'] >= minIndex) {
				var urlStart = result[1];

				if (result[1].charAt(0) != 'h') {
					urlStart = 'http://' + urlStart;
				}

				var visibleLink = result[0];
				var href = urlStart + result[5] + result[6];
				var anchorTag = "<a href='" + href + "' target='_blank'>" + visibleLink + "</a>";

				minIndex += anchorTag.length;

				msg = msg.substr(0, result['index']) + anchorTag + msg.substr(result['index'] + visibleLink.length);
			}
		}

		return msg;
	}

	// Currently being done in the controller as I'm unable to access the scope from here.
	// TODO - Potentially refactor this to be done here rather than in the controller.
	function listenForUsers() {
		
	}
}