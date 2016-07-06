'use strict'

angular
	.module('messaging')
	.controller('MessagingController', MessagingController);

MessagingController.$inject = ['chatSocket', 'MessagingService', '$scope', '$location', '$sce'];

function MessagingController(chatSocket, MessagingService, $scope, $location, $sce) {
	var vm = this;

	vm.activeUsers = [];
	vm.seenByAlert = '';
	vm.messageSeenBy = [];
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

		chatSocket.on('new message', function(msg) {
			clearUserTypingAlert(msg.user);

			vm.messageSeenBy = [];
			confirmMessageSeen(vm.messageSeenBy, msg.user);
			vm.seenByAlert = updateSeenByAlert(vm.messageSeenBy);

			MessagingService.updateUnreadMessageCount();
			MessagingService.playMessageAlert(msg.user);

			vm.messageStorage.push(msg);

			scrollDown();
		});

		chatSocket.on('send user list', function(activeUsers) {
			vm.activeUsers = activeUsers;
			vm.seenByAlert = updateSeenByAlert(vm.messageSeenBy);
		});

		chatSocket.on('sending messageSeenBy array', function(messageSeenBy) {
			vm.messageSeenBy = messageSeenBy;		
			vm.seenByAlert = updateSeenByAlert(messageSeenBy);
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

		window.addEventListener("focus", function() {
			setTimeout(function() {
				resetTitle();
				confirmMessageSeen(vm.messageSeenBy);
			},0);
		});
	}

	///// Functions /////
	
	function adjustTextareaSize() {
		MessagingService.adjustTextareaSize();
	}

	function confirmMessageSeen(seenByArray, sentBy) {
		setTimeout(function() {
			if (!document.hasFocus()) {
				return;
			}

			if (!sentBy) {
				var message = vm.messageStorage[vm.messageStorage.length-1];
				if (!message) return;
				sentBy = message.user;
				if (!sentBy) return;
			}

			var index = seenByArray.indexOf(chatSocket.username);
			if (index > -1) {
				return;
			}

			if (sentBy == chatSocket.username) {
				return;
			}

			chatSocket.emit('message seen', chatSocket.username);
		},0);
	}

	function checkLoginStatus() {
		var promise = MessagingService.checkLoginStatus();

		promise.then(function(response) {
			if (!response) {
				$scope.$apply(function() {
					$location.path('login');
				});
			} else {
				focusTextarea();
				getInitialCssValues();
				activateListeners();				
			}
		});
	}

	function clearUserTypingAlert(username) {
		var index = vm.typingArray.indexOf(username);
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

	function scrollDown(force) {
		MessagingService.scrollDown(force);
	}

	function sendMessage(msg) {
		if (msg) {
			msg = insertAnchorTags(msg);
			$sce.trustAsHtml(msg);
				
			chatSocket.emit('sending message', msg);
	
			vm.msg = '';
			document.getElementById('message-textarea').value = '';

			clearUserTypingAlert(chatSocket.username);

			scrollDown(true);
			focusTextarea();	
		}
	}

	function updateSeenByAlert(seenByArray) {
		var displayArray = [];
		var seenByCurrentUser = false;

		for (var i = 0; i < seenByArray.length; i++) {
			if (seenByArray[i] != chatSocket.username) {
				displayArray.push(seenByArray[i]);
			} else {
				seenByCurrentUser = true;
			}
		}
		
		if (displayArray.length < 1) return '';

		if(vm.activeUsers.length > 2) {
			var newestMessage = vm.messageStorage[vm.messageStorage.length-1];

			if ((newestMessage.user == chatSocket.username && displayArray.length == vm.activeUsers.length - 1) ||
				 newestMessage.user != chatSocket.username && displayArray.length == vm.activeUsers.length - 2 && seenByCurrentUser) {
				return "Seen by all.";
			} 
		}

		var returnString = "Seen by " + displayArray.join(", ");
		var lastCommaIndex = returnString.lastIndexOf(",");
		if (lastCommaIndex > 0) {
			returnString = returnString.substr(0, lastCommaIndex) + " and" + returnString.substr(lastCommaIndex + 1, returnString.length);
		}
		
		return returnString + ".";
	}

	function updateTypingString() {
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
	}
}