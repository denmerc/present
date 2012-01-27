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
			if (result && result.authenticated) {
				console.log(result);
                req.session.nickname = 'Tim';
                console.log('Setting nickname to ' + req.session.nickname);
				res.redirect('/chat');
				return;
			}

			res.render('index', {
				authenticated: false
			});
		});
	});
}