var relyingParty = require('../relyingParty.js');

module.exports = function(app) {
	app.post('/auth', function(req, res) {
		relyingParty.authenticate(req.body.identifier, req.headers.origin + '/verify', function(error, authUrl) {
			if (error) {
				console.log(error);
				res.render('auth', {
					'error': error
				});
			}
			else if (!authUrl) {
				res.render('auth', {
					'error': 'Authentication Failed'
				});
			}
			else {
				console.log(authUrl);
				res.redirect(authUrl);
			}
		});
	});

	app.get('/verify', function(req, res) {
		relyingParty.verifyAssertion(req, function(error, result) {
			if (result) {
				console.log(result);
				res.render('verify', {
					authenticated: result.authenticated
				});
				return;
			}

			res.render('verify', {
				authenticated: false
			});
		});
	});
}