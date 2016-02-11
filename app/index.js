'use strict';
let express = require('express');
let http = require('http');
let socket_io = require('socket.io');
let iohandler = require('./iohandler.js');
let taskmanager = require('./taskmanager.js')

let app = express();
let server = http.Server(app);
global.io = socket_io(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', iohandler);

server.listen(3000, () => console.log("Server Started"));

setInterval(taskmanager, 50);
