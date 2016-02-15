var _ = require('lodash');
var gameData = require('./data.js');
var constants = require('./constants.js');

var getIntersect = function (entry) {
    var intersect = null;
    gameData[entry.map].forEach(function (mapObj) {
        if (entry.x + entry.w > mapObj.x && entry.x < mapObj.x + mapObj.w) {
            if (entry.y <= mapObj.y) { //drueber
                intersect = mapObj;
            }
        }
    });
    return intersect;
}

var task = function () {
    _.each(gameData.user, function (entry) {
        if (entry.socketId === null) {
            return;
        }

        var intersectBefore = getIntersect(entry);

        if (intersectBefore === null) {
            intersectBefore = {
                x: 0,
                y: 900,
                w: 1200,
                h: 1
            }
        }

        if (entry.keys[constants.up] === true) {
            if (entry.jumping === false) {
                if (entry.y >= intersectBefore.y - entry.h) {
                    entry.jumpcounter = constants.jumpcounter;
                    entry.jumping = true
                }

            }
        }
        if (entry.keys[constants.down] === true) {
            if (entry.jumping) {
                entry.y += constants.speed;
            }
        }
        if (entry.keys[constants.right] === true) {
            entry.x += constants.speed;
        }
        if (entry.keys[constants.left] === true) {
            entry.x -= constants.speed;
        }

        if (entry.jumpcounter > 0) {
            entry.y -= constants.jumpheight;
            entry.jumpcounter -= 1;
        } else {
            entry.jumping = false;
        }

        var intersect = getIntersect(entry);

        if (intersect === null) {
            intersect = {
                x: 0,
                y: 900,
                w: 1200,
                h: 1
            }
        }
        if (entry.y < intersect.y - entry.h) {
            entry.y += constants.gravity;
        } else {
            entry.y = intersect.y - entry.h;
        }


    });



    io.emit('update', gameData);
};

module.exports = task;
