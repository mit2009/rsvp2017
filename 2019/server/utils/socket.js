"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameHandler = require("../utils/gameHandler");
var duelHandler = require("../utils/duelHandler");
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
            socket.emit("levelData", JSON.stringify(blob));
        });
        socket.on("getUpdate", function (guid, up, down, left, right, fire) {
            var blob = gameHandler.update(guid, up, down, left, right, fire);
            socket.emit("levelUpdate", JSON.stringify(blob));
        });
        socket.on("duelUpdate", function (data) {
            var response = duelHandler.update(data, io);
            io.emit("duelResponse", JSON.stringify(response));
        });
        socket.on("disconnect", function () {
            console.log(socket.id + " disconnected");
        });
    });
}
exports.initSocket = initSocket;
//# sourceMappingURL=socket.js.map