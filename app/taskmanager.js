var _ = require('lodash');
var gameData = require('./data.js');
var constants = require('./constants.js');

var task = function() {
    _.each(gameData.user, function(entry) {
        if (entry.socketId === null) {
            return;
        }

        if (entry.keys[constants.up] === true) {
            entry.y -= 25;
        } else if (entry.keys[constants.down] === true) {
            // entry.y += 5;
        } else if (entry.keys[constants.right] === true) {
            entry.x += 5;
        } else if (entry.keys[constants.left] === true) {
            entry.x -= 5;
        }

        if (entry.y < 780) {
            entry.y += 5;
        }


    });



    io.emit('update', gameData);
};

module.exports = task;
