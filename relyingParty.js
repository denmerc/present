var openid = require('openid');

var extensions = [new openid.SimpleRegistration({
	'nickname': true
})];

var relyingParty = new openid.RelyingParty('http://localhost:3000/verify', // Verification URL (yours)
    null, // Realm (optional, specifies realm for OpenID authentication)
    false, // Use stateless verification
    false, // Strict mode
    extensions); // List of extensions to enable and include

exports.authenticate = function(identifier, returnUrl, callback) {
	console.log('returnUrl: ' + returnUrl);
	relyingParty.returnUrl = returnUrl;
	relyingParty.authenticate(identifier, false, callback);
}

exports.verifyAssertion = function(request, callback) {
	relyingParty.verifyAssertion(request, callback);
}