var express = require('express');
var sys = require('sys');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
io.set('log level', 2);

app.configure(function() {
	app.set('routePath', './routes/');
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jshtml');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
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

io.sockets.on('connection', function (socket) {
    socket.on('mouse-location', function (data) {
        data.id = socket.id;
        socket.broadcast.emit('mouse-location', data);
    });

    socket.on('message', function (data) {
        console.log(data);
        socket.broadcast.emit('message', data);
    });

});

var config = {user: "", password: "", track: ["#fldebate"]},
twitter = new (require("twitter-node").TwitterNode)(config);

twitter.addListener('error', function(error) {
    console.log(error.message);
});

twitter.addListener('tweet', function(tweet) {
    var message = '@' + tweet.user.screen_name + ': ' + tweet.text;
    io.sockets.send(message);
}).addListener('limit', function(limit) {
	console.log('LIMIT: ' + sys.inspect(limit));
}).addListener('delete', function(del) {
	console.log('DELETE: ' + sys.inspect(del));
}).addListener('end', function(resp) {
	console.log('wave goodbye...' + resp.statusCode);
}).stream();

app.listen(process.env.PORT, '0.0.0.0');
console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env);    