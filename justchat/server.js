var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3002);

console.log('Server running...');
app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

    //  Connected
    io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);

    // Disconnected
    socket.on('disconnect', function(data){
         users.splice(users.indexOf(socket.username), 1);
         updateUsernames();
         connections.splice(connections.indexOf(socket), 1);
         console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Messages
        socket.on("send message", function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    // New User
    socket.on('new user', function(data, callback){

        callback(true);
        socket.username = data ;
        users.push(socket.username);
        updateUsernames();

    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
      
});