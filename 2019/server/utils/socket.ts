import * as socketio from "socket.io";
import * as gameHandler from "../utils/gameHandler";
import * as duelHandler from "../utils/duelHandler";

let io: socketio.Server;

import { PageState } from "../../app/duelPage";

export function initSocket(http: any) {
    io = require("socket.io")(http);

    io.on("connection", socket => {
        console.log(`${socket.id} connected`);

        socket.on("init", (guid: string) => {
            console.log(guid);
        });

        socket.on("levelUp", (guid: string) => {
            const blob = gameHandler.levelUp(guid);
            socket.emit("levelData", JSON.stringify(blob));
        });

        socket.on(
            "getUpdate",
            (
                guid: string,
                up: boolean,
                down: boolean,
                left: boolean,
                right: boolean,
                fire: boolean
            ) => {
                const blob = gameHandler.update(
                    guid,
                    up,
                    down,
                    left,
                    right,
                    fire
                );
                socket.emit("levelUpdate", JSON.stringify(blob));
            }
        );

        socket.on("duelUpdate", (data: any) => {
            console.log("RAW:", data);
            try {
                const response = duelHandler.update(data, io);
                io.emit("duelResponse", JSON.stringify(response));
            } catch (e) {
                console.error(e);
            }
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}
