'use strict'

describe('Chat application', function() {
	it("redirect 'index.html' to 'index.html/#!/login", function() {
		browser.get('index.html');
		expect(browser.getLocationAbsUrl()).toBe('/login');
	});
});


/*
describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://juliemr.github.io/protractor-demo/');

    expect(browser.getTitle()).toEqual('Super Calculator');
  });
});
*/