'use strict'

angular
	.module('messaging')
	.controller('MessagingController', MessagingController);

MessagingController.$inject = ['chatSocket', 'MessagingService', '$scope', '$location', '$sce'];

function MessagingController(chatSocket, MessagingService, $scope, $location, $sce) {
	var vm = this;

	vm.messageStorage = [];
	vm.msg = '';
	
	//vm.adjustTextareaSize = adjustTextareaSize;
	vm.checkLoginStatus = checkLoginStatus;
	vm.focusTextarea = focusTextarea;
	vm.insertAnchorTags = insertAnchorTags;
	//vm.listenForEnter = listenForEnter;
	vm.resetTitle = resetTitle;
	vm.sendMessage = sendMessage;
	
	/////////////////////
	
	checkLoginStatus();
	focusTextarea();
	//listenForEnter();
	
	//TODO - Trigger this by activating window, rather than on a constantly running interval.
	setInterval(function() {
		resetTitle();
	}, 2000);
	
	chatSocket.emit('request activeUsers', function(activeUsers) {
		vm.activeUsers = activeUsers;
	});

	chatSocket.on('send user list', function(activeUsers) {
		vm.activeUsers = activeUsers;
	});

	chatSocket.on('new message', function(msg) {
		var div = document.getElementById("received-messages");
		var scrollAtBottom = false;
		if (div.scrollTop === (div.scrollHeight - div.offsetHeight)) {
			scrollAtBottom = true;
		}

		MessagingService.updateUnreadMessageCount();
		MessagingService.playMessageAlert();

		vm.messageStorage.push(msg);

		if (scrollAtBottom) {
			scrollDown();
		}
	});

	document.onkeydown = function(e) {
		if (e.keyCode == 13 && document.activeElement.id == 'message-textarea' && !e.shiftKey) {
			sendMessage(vm.msg);
		}

		
		setTimeout(function() {
			adjustTextareaSize(e);
		}, 0);
		
	}
/*
	// Backspace is not registered by onkeypress, so we catch it via onkeydown instead.
	document.onkeydown = function(e) {
		if (e.keyCode == 8) {
			adjustTextareaSize(e);
		}
	}
*/
/*
	document.onkeyup = function(e) {
		if (e.ctrlKey && e.keyCode == 86) {
			adjustTextareaSize(e);
		}
	}
*/

/*
	document.getElementById('message-textarea').addEventListener("paste", function(e) {
		//alert(e.clipboardData.getData('Text'));
		adjustTextareaSize(e);
		//console.log(e);
	});
*/

	function adjustTextareaSize() {
		var textarea = document.getElementById('message-textarea');
		var messagesDiv = document.getElementById('received-messages');

		if (vm.msg.length == 0) {
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
			if (newTextareaHeight > 282) {
				textarea.style.height = "282px";				
				messagesDiv.style.height = "calc(80% - 240px)";
			}

			messagesDiv.scrollTop = messagesDiv.scrollTop - (initialTextareaHeight - newTextareaHeight);
		}
	}

	function checkLoginStatus() {
		var promise = MessagingService.checkLoginStatus();

		promise.then(function(response) {
			if (!response) {
				console.log("You are not logged in!");
				$scope.$apply(function() {
					$location.path('login');
				});
			}
		});
	}

	function resetTitle() {
		MessagingService.resetTitle();
	}

	function focusTextarea() {
		MessagingService.focusTextarea();
	}

	function insertAnchorTags(msg) {
		return MessagingService.insertAnchorTags(msg);
	}

	function listenForUsers() {
		return MessagingService.listenForUsers();
	}

	// This is triggered by a callback because it needs to happen AFTER the new message has been received from the server.
	// A later alternative might be to use a promise to only trigger this once the new message has been received. (TODO)
	function scrollDown() {
		chatSocket.emit('scroll down', function(callback) {
			var objDiv = document.getElementById("received-messages");
			objDiv.scrollTop = objDiv.scrollHeight;
		});
	}

	function sendMessage(msg) {
		console.log("tying to send message");
		if (msg) {
			msg = insertAnchorTags(msg);
			$sce.trustAsHtml(msg);
			
			chatSocket.emit('sending message', msg);
			scrollDown();
			vm.msg = '';
			focusTextarea();
			setTimeout(function() {
				adjustTextareaSize();	
			}, 0);
			
		}
	}
}