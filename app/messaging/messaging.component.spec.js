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

		


	});

});