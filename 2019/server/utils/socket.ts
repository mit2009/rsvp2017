import * as socketio from "socket.io";
import * as gameHandler from "../utils/gameHandler"

interface SocketMap {
    [key: string]: socketio.Socket;
}

const socketmap: SocketMap = {};
let io: socketio.Server;

export function init(http: any) {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`);

        socket.on("init", (guid: string) => {
            console.log(guid);
        });

        socket.on("levelUp", (guid: string) => {
            const blob = gameHandler.levelUp(guid);
            socket.emit("levelData", JSON.stringify(blob));
        });

        socket.on("getUpdate", (guid: string) => {
            const blob = gameHandler.update(guid);
            socket.emit("levelUpdate", JSON.stringify(blob));
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}
