"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameHandler = require("../utils/gameHandler");
var socketmap = {};
var io;
function init(http) {
    io = require("socket.io")(http);
    io.on("connection", function (socket) {
        console.log(socket.id + " connected");
        socket.on("init", function (guid) {
            console.log(guid);
        });
        socket.on("levelUp", function (guid) {
            var blob = gameHandler.levelUp(guid);
            socket.emit("levelData", JSON.stringify(blob));
        });
        socket.on("getUpdate", function (guid) {
            var blob = gameHandler.update(guid);
            socket.emit("levelUpdate", JSON.stringify(blob));
        });
        socket.on("disconnect", function () {
            console.log(socket.id + " disconnected");
        });
    });
}
exports.init = init;
//# sourceMappingURL=socket.js.map