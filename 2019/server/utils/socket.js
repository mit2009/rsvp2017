"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketmap = {};
var io;
function init(http) {
    io = require("socket.io")(http);
    io.on("connection", function (socket) {
        console.log(socket.id + " connected");
        socket.on("init", function (username) {
            socketmap[username] = socket;
        });
        socket.on("disconnect", function () {
            console.log(socket.id + " disconnected");
        });
    });
}
exports.init = init;
//# sourceMappingURL=socket.js.map