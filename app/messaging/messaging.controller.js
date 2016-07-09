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

	checkLoginStatus(true);
	
	///// Listeners /////

	function adjustTextareaSize() {
		MessagingService.adjustTextareaSize();
	}

	function activateListeners() {
		chatSocket.emit('request activeUsers', function(activeUsers) {
			vm.activeUsers = activeUsers;
		});

		chatSocket.on('announce user', function(announcement, username) {
			var index = vm.activeUsers.indexOf(username);
			if (index > -1 && username != chatSocket.username) {
				vm.messageStorage.push({userAnnouncement: announcement});
				scrollDown();
			}
		});

		chatSocket.on('new message', function(msg) {
			clearUserTypingAlert(msg.user);

			vm.messageSeenBy = [];
			confirmMessageSeen(vm.messageSeenBy, msg.user);
			vm.seenByAlert = updateSeenByAlert(vm.messageSeenBy, vm.activeUsers, vm.messageStorage);

			MessagingService.updateUnreadMessageCount();
			MessagingService.playMessageAlert(msg.user);

			vm.messageStorage.push(msg);

			scrollDown();
		});

		chatSocket.on('redirect to login', function() {
			$scope.$apply(function() {
				console.log("Session expired.");
				$location.path('login');
			});
		});

		chatSocket.on('remove listeners', function() {
			console.log("Removing focus event listener");
			window.removeEventListener("focus", focusEventListener);
			chatSocket.removeAllListeners();
			document.onkeydown = null;
			delete chatSocket.username;

			var page = window.location.href.slice(-5);
			if(page != "login") {
				console.log("Forcing redirect to login page");
				$scope.$apply(function() {
					$location.path('login');
				});
			}
		});

		chatSocket.on('send user list', function(activeUsers) {
			vm.activeUsers = activeUsers;
			vm.seenByAlert = updateSeenByAlert(vm.messageSeenBy, vm.activeUsers, vm.messageStorage);
		});

		chatSocket.on('sending messageSeenBy array', function(messageSeenBy) {
			vm.messageSeenBy = messageSeenBy;		
			vm.seenByAlert = updateSeenByAlert(messageSeenBy, vm.activeUsers, vm.messageStorage);
		});

		chatSocket.on('update typing array', function(username) {
			if (username == chatSocket.username) {
				return;
			}

			if (vm.typingArray.indexOf(username) < 0) {
				vm.typingArray.push(username);
				updateTypingString(vm.typingArray);
			}

			if (vm.typingAlertTimeouts[username]) {
				clearTimeout(vm.typingAlertTimeouts[username]);
			}
			
			vm.typingAlertTimeouts[username] = 	setTimeout(function() {
				clearUserTypingAlert(username);
			}, 3000);
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

		window.addEventListener("focus", focusEventListener);
	}

	///// Functions /////

	function confirmMessageSeen(seenByArray, sentBy) {
		setTimeout(function() {
			if (!document.hasFocus() || document.hidden) {
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

	function checkLoginStatus(initialLogin = false) {
		var promise = MessagingService.checkLoginStatus();

		promise.then(function(response) {
			if (response && initialLogin) {
				focusTextarea();
				getInitialCssValues();
				activateListeners();
			} else if (!response) {
				$scope.$apply(function() {
					$location.path('login');
				});
			} else {
				return true;
			}
		});
	}

	function clearUserTypingAlert(username) {
		var index = vm.typingArray.indexOf(username);
		if (index > -1) {
			vm.typingArray.splice(index, 1);
			updateTypingString(vm.typingArray);
		}
	}

	function focusEventListener() {
		checkLoginStatus();

		setTimeout(function() {
			resetTitle();
			confirmMessageSeen(vm.messageSeenBy);
		},0);
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
		// This is here as a tempory solution until I find a way to trigger a function by the browser app being reopened on tablet/mobile. TODO
		checkLoginStatus();

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

	function updateSeenByAlert(seenByArray, activeUsers, messageStorage) {
		return MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage);
	}

	function updateTypingString(typingArray) {
		console.log(typingArray);
		$scope.$apply(function() {
			vm.typingString = MessagingService.updateTypingString(typingArray);
		});
	}
/*
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
*/
}