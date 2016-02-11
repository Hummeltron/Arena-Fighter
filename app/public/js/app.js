var $ = require('jquery');
var _ = require('lodash');

var constants = require('../../constants.js');

var gameView = constants.city;

var gameData = {}

$('#username').on('keydown', function(event) {
    if (event.keyCode === 13) {
        var username = $('#username').val();
        $('#username').val('');
        socket.emit('login', username);
    }
});

socket.on('login', function(error) {
    if (error === null) {
        $('#login-form').hide();
        $('#stage').show();
        game();
    }
});

var game = function() {
    var that = this;
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");
    var running = false;
    var resizeHeight = function(newHeight) {
        $('#stage').height(newHeight);
        var aspect = constants.stageHeight / constants.stageWidth;
        $('#stage').width(newHeight / aspect);
    };

    // var tiles = new Image();
    // tiles.addEventListener("load", function() {
    //     // execute drawImage statements here
    // }, false);
    // tiles.src = 'res/tiles.png';

    var keyDown = function(event) {
        event.preventDefault();

        if (event.keyCode === 37) { //left
            socket.emit('keydown', constants.left);
        } else if (event.keyCode === 38) { //up
            socket.emit('keydown', constants.up);
        } else if (event.keyCode === 39) { //right
            socket.emit('keydown', constants.right);
        } else if (event.keyCode === 40) { //down
            socket.emit('keydown', constants.down);
        } else if (event.keyCode === 32) { //down
            socket.emit('keydown', constants.space);
        }
    };

    var keyUp = function(event) {
        event.preventDefault();
        if (event.keyCode === 37) { //left
            socket.emit('keyup', constants.left);
        } else if (event.keyCode === 38) { //up
            socket.emit('keyup', constants.up);
        } else if (event.keyCode === 39) { //right
            socket.emit('keyup', constants.right);
        } else if (event.keyCode === 40) { //down
            socket.emit('keyup', constants.down);
        } else if (event.keyCode === 32) { //down
            socket.emit('keyup', constants.space);
        }
    }
    var init = function() {
        clear();
        ctx.fillStyle = "#F00";
        ctx.fillRect(0, 0, 5, 5);
        ctx.fillRect(constants.stageWidth - 5, 0, 5, 5);
        ctx.fillRect(0, constants.stageHeight - 5, 5, 5);
        ctx.fillRect(constants.stageWidth - 5, constants.stageHeight - 5, 5, 5);
        ctx.fillRect(constants.stageWidth / 2 - 3, constants.stageHeight / 2 - 3, 6, 6);
        if ($(window).height() < constants.stageHeight) {
            resizeHeight($(window).height());
        }
        //KeyDown
        document.addEventListener("keydown", keyDown);
        //KeyUp
        document.addEventListener("keyup", keyUp);

        socket.on('update', updateStage);
    };

    var updateStage = function(data) {
        gameData = data;
    }

    var clear = function() {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, constants.stageWidth, constants.stageHeight);
    };

    var render = function() {
        clear();
        if (gameView === constants.city) {
            cityView();
        }
        if (running) {
            window.requestAnimationFrame(render);
        }
    };

    var cityView = function() {
        ctx.fillStyle = "#000";
        _.each(gameData.cityMap, function(entry) {
            ctx.fillRect(entry.x, entry.y, entry.w, entry.h);
        });

        ctx.fillStyle = "#00F";
        _.each(gameData.user, function(entry) {
            ctx.fillRect(entry.x, entry.y, 20, 20);
        });
    };

    var startLoop = function() {
        running = true;
        window.requestAnimationFrame(render);
    };
    var stopLoop = function() {
        running = false;
    }
    init();
    startLoop();
};
