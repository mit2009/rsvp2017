"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameHandler = require("../utils/gameHandler");
var io;
function initSocket(http) {
    io = require("socket.io")(http);
    io.on("connection", function (socket) {
        console.log(socket.id + " connected");
        socket.on("init", function (guid) {
            console.log(guid);
        });
        socket.on("levelUp", function (guid) {
            var blob = gameHandler.levelUp(guid);
            setTimeout(function () { return socket.emit("levelData", JSON.stringify(blob), 1000); });
        });
        socket.on("getUpdate", function (guid, up, down, left, right, fire) {
            var blob = gameHandler.update(guid, up, down, left, right, fire);
            socket.emit("levelUpdate", JSON.stringify(blob));
        });
        socket.on("disconnect", function () {
            console.log(socket.id + " disconnected");
        });
    });
}
exports.initSocket = initSocket;
//# sourceMappingURL=socket.js.map