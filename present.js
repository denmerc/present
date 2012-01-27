var express = require('express');
var app = module.exports = express.createServer();

app.configure(function() {
	app.set('routePath', './routes/');
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jshtml');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: '8ae01c0e-c9dd-46f7-91a1-99b0c528b9b0'}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public/'));
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
require('./sockets')(app);

app.listen(process.env.PORT, '0.0.0.0');
console.log('Express server listening on port %d in %s mode', process.env.PORT, app.settings.env);
