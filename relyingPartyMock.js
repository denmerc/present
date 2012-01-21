
var authUrl =  'http://localhost:3000/verify';

exports.authenticate = function(identifier, callback) {
	console.log('rp.mock.authenticate');
	callback('', authUrl);
}

exports.verifyAssertion = function(request, callback) {
	console.log('rp.mock.verifyAssertion');
	var result = [];
	result.authenticated = true;
	callback('', result);
}
