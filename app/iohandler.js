'use strict';

let iohandler = function(socket) {
    console.log("Connected!", socket.id);
    socket.on("disconnect", () => console.log("disco"));
};

module.exports = iohandler;
