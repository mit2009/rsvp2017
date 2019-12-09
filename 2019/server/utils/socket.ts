import * as socketio from "socket.io";
import * as gameHandler from "../utils/gameHandler"

let io: socketio.Server;

export function initSocket(http: any) {
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

        socket.on("getUpdate", (guid: string, up: boolean, down: boolean, left: boolean, right: boolean, fire: boolean) => {
            const blob = gameHandler.update(guid, up, down, left, right, fire);
            if (blob) {
                socket.emit("levelUpdate", JSON.stringify(blob));
            }
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}
