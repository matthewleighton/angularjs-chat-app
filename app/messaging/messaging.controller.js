'use strict'

angular
	.module('messaging')
	.controller('MessagingController', MessagingController);

MessagingController.$inject = ['chatSocket', 'MessagingService', '$scope', '$location', '$sce'];

function MessagingController(chatSocket, MessagingService, $scope, $location, $sce) {
	var vm = this;

	vm.messageStorage = [];
	vm.msg = '';
	vm.typingAlertTimeouts = {};
	vm.typingArray = [];
	vm.typingString = '';
	
	vm.checkLoginStatus = checkLoginStatus;
	vm.focusTextarea = focusTextarea;
	vm.insertAnchorTags = insertAnchorTags;
	vm.resetTitle = resetTitle;
	vm.sendMessage = sendMessage;

	
	/////////////////////
	
	checkLoginStatus();

	///// Listeners /////

	function activateListeners() {
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

		chatSocket.on('update typing array', function(username) {
			if (username == chatSocket.username) {
				return;
			}

			if (vm.typingArray.indexOf(username) < 0) {
				vm.typingArray.push(username);
				updateTypingString();
			}

			if (vm.typingAlertTimeouts[username] > -1) {
				clearTimeout(vm.typingAlertTimeouts[username]);
			}
			
			vm.typingAlertTimeouts[username] = 	setTimeout(function() {
				clearUserTypingAlert(username);
			}, 2000);
		});

		document.onkeydown = function(e) {
			if (document.activeElement.id == 'message-textarea') {
				if (e.keyCode != 13) {
					chatSocket.emit('user is typing');
				} else if (e.keyCode == 13 && !e.shiftKey) {
					e.preventDefault();
					sendMessage(vm.msg);
				}

				setTimeout(function() {
					adjustTextareaSize();
				}, 0);
			}
		}	
	}

	///// Functions /////
	
	function adjustTextareaSize() {
		MessagingService.adjustTextareaSize();
	}

	function checkLoginStatus() {
		var promise = MessagingService.checkLoginStatus();

		promise.then(function(response) {
			if (!response) {
				console.log("You are not logged in!");
				$scope.$apply(function() {
					$location.path('login');
				});
			} else {
				focusTextarea();
				getInitialCssValues();
				activateListeners();
				
				//TODO - Trigger this by activating window, rather than on a constantly running interval.
				setInterval(function() {
					resetTitle();
				}, 2000);
			}
		});
	}

	function clearUserTypingAlert(username) {
		console.log("Trying to remove user from typing array...");
		var index = vm.typingArray.indexOf(username);
		console.log(index);
		if (index > -1) {
			vm.typingArray.splice(index, 1);
			updateTypingString();
		}
	}

	function focusTextarea() {
		MessagingService.focusTextarea();
	}

	function getInitialCssValues() {
		MessagingService.getInitialCssValues();
	}

	function insertAnchorTags(msg) {
		return MessagingService.insertAnchorTags(msg);
	}

	function listenForUsers() {
		return MessagingService.listenForUsers();
	}

	function resetTitle() {
		MessagingService.resetTitle();
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
		if (msg) {
			msg = insertAnchorTags(msg);
			$sce.trustAsHtml(msg);
			chatSocket.emit('sending message', msg);
			
			vm.msg = '';
			document.getElementById('message-textarea').value = '';

			clearUserTypingAlert(chatSocket.username);

			scrollDown();
			focusTextarea();
		}
	}

	function updateTypingString() {
		console.log('Updating typing string');
		
		$scope.$apply(function() {
			if (vm.typingArray.length == 0) {
				vm.typingString = '';
			} else if (vm.typingArray.length == 1) {
				vm.typingString = vm.typingArray[0] + " is typing...";
			} else if (vm.typingArray.length > 1 && vm.typingArray.length < 4) {
				var string = vm.typingArray.join(", ") + " are typing...";
				var lastCommaIndex = string.lastIndexOf(",");
				vm.typingString = string.substr(0, lastCommaIndex) + " and" + string.substr(lastCommaIndex + 1, string.length);
			} else {
				vm.typingString = 'People are typing...';
			}
		});

		console.log(vm.typingString);
	}
}