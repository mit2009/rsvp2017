import * as socketio from "socket.io";

interface SocketMap {
    [key: string]: socketio.Socket;
}

const socketmap: SocketMap = {};
let io: socketio.Server;

export function init(http: any) {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`);

        socket.on("init", (username: string) => {
            socketmap[username] = socket;
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}
