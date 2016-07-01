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
		var reg = /\b((https?:\/\/www\.)|(https?:\/\/)|(www\.))(\w+\.[a-z.]+)(\S+)?/gi;

		var result;

		while (result = reg.exec(msg)) {


			console.log("///////////////////////////");
			if (!result[6] || (result[6].charAt(0) != "'" && result[6].charAt(0) != "<" && result[6].charAt(result[6].length-1) != ">")) {
				console.log("Transforming link");
				console.log("Element 6 is " + result[6]);

							
				var address = result[0];

				var urlStart = result[1];
				if (result[1].charAt(0) != 'h') {
					urlStart = 'http://' + result[1];
				}


				if (result[6]) {
					result[5] = result[5] + result[6];
				}

				var linkUrl = urlStart + result[5];
				var visibleUrl = result[1] + result[5];

				

				var anchorTag = "<a href='" + linkUrl + "' target='_blank'>" + address + "</a>";

				console.log(anchorTag);

				console.log("index is " + result['index']);

				msg = msg.substr(0, result['index']) + anchorTag + msg.substr(result['index'] + visibleUrl.length);
			}		
		}

		return msg;
	}

	// Currently being done in the controller as I'm unable to access the scope from here.
	// TODO - Potentially refactor this to be done here rather than in the controller.
	function listenForUsers() {
		
	}
}