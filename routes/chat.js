
module.exports = function(app) {
    app.get('/chat', function(req, res) {
        console.log('Rendering chat with nickname ' + req.session.nickname);
		res.render('chat', { nickname: req.session.nickname });
	});
}