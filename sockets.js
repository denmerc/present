
module.exports = function(app) {
    
    var io = require('socket.io').listen(app);
    io.set('log level', 2);
    
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
}