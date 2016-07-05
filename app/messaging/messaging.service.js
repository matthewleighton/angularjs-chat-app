'use strict'

angular
	.module('messaging')
	.factory('MessagingService', MessagingService);

MessagingService.$inject = ['chatSocket'];

function MessagingService(chatSocket) {
	var service = {
		unreadMessageCount : 0,
		messageAlertSound : new Audio('assets/audio/mail.mp3'),
		messageAlertTimeout : false,

		adjustTextareaSize : adjustTextareaSize,
		checkLoginStatus : checkLoginStatus,
		focusTextarea : focusTextarea,
		getInitialCssValues : getInitialCssValues,
		insertAnchorTags : insertAnchorTags,
		listenForUsers : listenForUsers,
		playMessageAlert : playMessageAlert,
		resetTitle : resetTitle,
		updateUnreadMessageCount : updateUnreadMessageCount
	}

	return service;
	////////////////////

	console.log("TEST!)");

	function adjustTextareaSize(msg) {
		var textarea = document.getElementById('message-textarea');
		var messagesDiv = document.getElementById('received-messages');

		if (textarea.value.length == 0) {
			// These are the initial values that the css should have when the page first loads.
			textarea.style.height = "42px";
			messagesDiv.style.height = "80%";
		} else {
			var form = document.getElementById('message-form');
			var initialTextareaHeight = textarea.style.height.slice(0, -2);
			
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 2 + 'px';

			var heightInt = parseInt(textarea.style.height.slice(0, -2)) - 42;
			
			messagesDiv.style.height = "calc(80% - " + heightInt + "px)";

			var newTextareaHeight = parseInt(textarea.style.height.slice(0, -2))

			// Setting a maximum height for the textarea
			// TODO - Specify where these values come from. Generate them rather than using them hard-coded.
			if (newTextareaHeight > 282) {
				textarea.style.height = "282px";				
				messagesDiv.style.height = "calc(80% - 240px)";
			}

			messagesDiv.scrollTop = messagesDiv.scrollTop - (initialTextareaHeight - newTextareaHeight);
		}
	}

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


	// TODO
	// Use this function to find the textarea/messagesDiv css values stored in the style sheet.
	// This is so that the ajustTextareaSize() function doesn't need to use hard-coded values for its reset values.
	// I need a way to get the value direct from the style sheet - The computed value does not work if the original value is a percentage.
	function getInitialCssValues() {
		var textarea = document.getElementById('message-textarea');
		textarea = window.getComputedStyle(textarea);

		var messagesDiv = document.getElementById('received-messages');
		messagesDiv = window.getComputedStyle(messagesDiv);

		this.initialCssValues = {
			textareaHeight : textarea.height,
			messagesDivHeight : messagesDiv.height
		}
	}

	function insertAnchorTags(msg) {
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

	function playMessageAlert() {
		var service = this;
		if (document.hidden && !service.messageAlertTimeout) {
			service.messageAlertSound.play();
			service.messageAlertTimeout = true;
			setTimeout(function() {
				service.messageAlertTimeout = false;
			}, 5000);
		}
	}

	function resetTitle() {
		if (!document.hidden) {
			window.document.title = "Chat App";
			this.unreadMessageCount = 0;
		}
	}

	function updateUnreadMessageCount() {
		if (document.hidden) {
			this.unreadMessageCount += 1;
			window.document.title = "Chat App(" + this.unreadMessageCount + ")";
		}
	}
}