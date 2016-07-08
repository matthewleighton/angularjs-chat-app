'use strict'

describe('login module', function() {
	
	var loginService;

	beforeEach(angular.mock.module('chatApp'));


	beforeEach(inject(function(_MessagingService_) {
		MessagingService = _MessagingService_;
	}));

	describe('messaging service', function() {

		describe('insertAnchorTags function', function() {
			it("should wrap a tag around www.example.com", function() {
				var input = "www.example.com";
				var expectedOutput = "<a href='http://www.example.com' target='_blank'>www.example.com</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around http://www.example.com", function() {
				var input = "http://www.example.com";
				var expectedOutput = "<a href='http://www.example.com' target='_blank'>http://www.example.com</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around https://www.example.com", function() {
				var input = "https://www.example.com";
				var expectedOutput = "<a href='https://www.example.com' target='_blank'>https://www.example.com</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around http://example.com", function() {
				var input = "http://example.com";
				var expectedOutput = "<a href='http://example.com' target='_blank'>http://example.com</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around www.example.co.uk", function() {
				var input = "www.example.co.uk";
				var expectedOutput = "<a href='http://www.example.co.uk' target='_blank'>www.example.co.uk</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around http://example.co.uk", function() {
				var input = "http://example.co.uk";
				var expectedOutput = "<a href='http://example.co.uk' target='_blank'>http://example.co.uk</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around https://www.youtube.com/watch?v=xtxK5gbJ63U", function() {
				var input = "https://www.youtube.com/watch?v=xtxK5gbJ63U";
				var expectedOutput = "<a href='https://www.youtube.com/watch?v=xtxK5gbJ63U' target='_blank'>https://www.youtube.com/watch?v=xtxK5gbJ63U</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap a tag around https://www.reddit.com/r/spacex/comments/4qtdfk/core_spotted_near_phoenix_maricopacasa_grande/", function() {
				var input = "https://www.reddit.com/r/spacex/comments/4qtdfk/core_spotted_near_phoenix_maricopacasa_grande/";
				var expectedOutput = "<a href='https://www.reddit.com/r/spacex/comments/4qtdfk/core_spotted_near_phoenix_maricopacasa_grande/' target='_blank'>https://www.reddit.com/r/spacex/comments/4qtdfk/core_spotted_near_phoenix_maricopacasa_grande/</a>";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should wrap two tags around two identical links seperated by a space", function() {
				var input = "www.example.com www.example.com";
				var tag = "<a href='http://www.example.com' target='_blank'>www.example.com</a>";
				var expectedOutput = tag + " " + tag;

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should only wrap tags around urls, leaving other text alone", function() {
				var input = "aaaaa www.example.com aaaaa https://example.co.uk aaaaa";
				var expectedOutput = "aaaaa <a href='http://www.example.com' target='_blank'>www.example.com</a> " +
									 "aaaaa <a href='https://example.co.uk' target='_blank'>https://example.co.uk</a> aaaaa";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});

			it("should not include a comma in the tag", function() {
				var input = "www.example.com,";
				var expectedOutput = "<a href='http://www.example.com' target='_blank'>www.example.com</a>,";

				expect(MessagingService.insertAnchorTags(input)).toEqual(expectedOutput);
			});			
		});

		describe('updateSeenByAlert function', function() {
			var seenByArray, activeUsers, messageStorage, chatSocket;

			beforeEach(inject(function(_chatSocket_) {
				chatSocket = _chatSocket_;
				chatSocket.username = 'One';
				
				messageStorage = [{
					'timestamp' : '7/7, 20:55',
					'body' : 'abcdefg'
				}];
			}));

			it("should return an empty string when no one has seen another user's message", function() {
				activeUsers = ['One', 'Two'];
				seenByArray = [];
				messageStorage[0].user = 'Two';				

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('');
			});

			it("should return an empty string when no one has seen your own message", function() {
				activeUsers = ['One', 'Two'];
				seenByArray = [];
				messageStorage[0].user = 'One';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('');
			});

			it("should return an empty string when there are 2 users, and you have seen the other's message", function() {
				activeUsers = ['One', 'Two'];
				seenByArray = ['One'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('');
			});

			it("should return 'Seen by name.' when there are 2 users, and the other has seen your message", function() {
				activeUsers = ['One', 'Two'];
				seenByArray = ['Two'];
				messageStorage[0].user = 'One';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by Two.');
			});

			it("should return an empty string when there are 3 users, and you are the only user who's seen a sent message", function() {
				activeUsers = ['One', 'Two', 'Three'];
				seenByArray = ['One'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('');
			});

			it("should return 'Seen by name.' when there are 3 users, and another user has seen the sent message, but you have not", function() {
				activeUsers = ['One', 'Two', 'Three'];
				seenByArray = ['Three'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by Three.');
			});

			it("should return 'Seen by all.' when there are 3 users, and everyone has seen the message", function() {
				activeUsers = ['One', 'Two', 'Three'];
				seenByArray = ['One', 'Three'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by all.');
			});

			it("should return 'Seen by name and name.' when there are 4 users, and two have seen the message but you have not", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four'];
				seenByArray = ['Three', 'Four'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by Three and Four.');
			});

			it("should return 'Seen by name.' when there are 4 users, and two have seen the message including you", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four'];
				seenByArray = ['One', 'Four'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by Four.');
			});

			it("should return 'Seen by all.' when there are 4 users, all 3 recipients have seen the message", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four'];
				seenByArray = ['One', 'Three', 'Four'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by all.');
			});

			it("should return 'Seen by name, name and name.' when there are 5 users, and 3 of them have seen the message but you have not", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four', 'Five'];
				seenByArray = ['Three', 'Four', 'Five'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by Three, Four and Five.');
			});

			it("should return 'Seen by name and name.' when there are 5 users, and 3 of them have seen the message including you", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four', 'Five'];
				seenByArray = ['One', 'Three', 'Four'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by Three and Four.');
			});

			it("should return 'Seen by all.' when there are 5 users and all 4 recipients have seen the message", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four', 'Five'];
				seenByArray = ['One', 'Three', 'Four', 'Five'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by all.');
			});

			it("should return 'Seen by 5 users.' when there are 7 users and 5 have seen the message, not including you", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
				seenByArray = ['Three', 'Four', 'Five', 'Six', 'Seven'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by 5 users.');
			});

			it("should return 'Seen by all.' when there are 7 users and all 6 recipients have seen the message", function() {
				activeUsers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
				seenByArray = ['One', 'Three', 'Four', 'Five', 'Six', 'Seven'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('Seen by all.');
			});

			it("should ignore the sender if they ended up in the seenByArray", function() {
				activeUsers = ['One', 'Two'];
				seenByArray = ['Two'];
				messageStorage[0].user = 'Two';

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('');
			});

			it("should return an empty string if the messageStorage is empty", function() {
				activeUsers = ['One', 'Two'];
				seenByArray = [];
				messageStorage = [];

				expect(MessagingService.updateSeenByAlert(seenByArray, activeUsers, messageStorage)).toEqual('');
			});
		});

		describe("updateTypingString function", function() {
			var typingArray;

			it("should return an empty string when the typingArray is empty", function() {
				typingArray = [];

				expect(MessagingService.updateTypingString(typingArray)).toEqual('');
			});

			it("should return 'Name is typing...' if the typingArray contains one user", function() {
				typingArray = ['One'];

				expect(MessagingService.updateTypingString(typingArray)).toEqual('One is typing...');
			});

			it("should return 'Name and Name are typing...' if the typingArray contains two users", function() {
				typingArray = ['One', 'Two'];

				expect(MessagingService.updateTypingString(typingArray)).toEqual('One and Two are typing...');
			});

			it("should return 'Name, Name and Name are typing...' if the typingArray contains one user", function() {
				typingArray = ['One', 'Two', 'Three'];

				expect(MessagingService.updateTypingString(typingArray)).toEqual('One, Two and Three are typing...');
			});

			it("should return 'x users are typing...' if the typingArray contains more than 3 users", function() {
				typingArray = ['One', 'Two', 'Three', 'Four'];

				expect(MessagingService.updateTypingString(typingArray)).toEqual('4 users are typing...');
			});
		});

		


	});

});