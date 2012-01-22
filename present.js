var express = require('express');

var app = module.exports = express.createServer();
//  Oh, hai there.
app.configure(function() {
	app.set('routePath', './routes/');
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jshtml');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

require('./routes')(app);

app.listen(process.env.PORT, '0.0.0.0');
console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env);