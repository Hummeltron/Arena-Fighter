'use strict';

var _ = require('lodash');
var gameData = require('./data.js');

var constants = require('./constants.js');

let iohandler = function(socket) {
    console.log("Connected!", socket.id);
    socket.on("disconnect", function() {
        if (socket.username) {
            gameData.user[socket.username].socketId = null;
        }
    });

    socket.on('login', function(username) {
        var error = null;
        if (_.has(gameData.user, username)) {
            if (gameData.user[username].socketId !== null) {
                error = 1;
            } else {
                gameData.user[username].socketId = socket.id;
                socket.username = username;
            }
        } else {
            //new player
            var keys = {};
            keys[constants.up] = false;
            keys[constants.left] = false;
            keys[constants.right] = false;
            keys[constants.down] = false;
            keys[constants.space] = false;

            gameData.user[username] = {
                socketId: socket.id,
                keys: keys,
                x: 500,
                y: 500,
                w: 20,
                h: 20,
                map:'cityMap',
                jumping:false,
                jumpcounter:0
            };
            socket.username = username;
        }
        socket.emit('login', error);
    });

    socket.on('keydown', function(key) {
        gameData.user[socket.username].keys[key] = true;
    });

    socket.on('keyup', function(key) {
        gameData.user[socket.username].keys[key] = false;
    });
};

module.exports = iohandler;
