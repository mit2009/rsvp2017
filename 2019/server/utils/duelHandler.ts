import { Duel } from "./duel";
import { IGameRenderData } from "../api/gameRenderData";
import {
    Command,
    IDuelSocketCommand,
    PageState,
    IDuelStateSocketData
} from "../api/levelDuelData";

let game: Duel = null;
let player0Ready = false;
let player1Ready = false;

export function update(data: IDuelSocketCommand, io: any) {
    console.log("This is DATA:", data);
    switch (data.user) {
        case -1:
            switch (data.command) {
                case Command.RESET_TO_ATTRACT:
                    game = null;
                    io.emit(
                        "duelResponse",
                        getResponse(PageState.ATTRACT, null, -1)
                    );
                    break;
                case Command.GO_TO_STAGING:
                    console.log("HERE");
                    game = new Duel(
                        data.params.player0Color,
                        data.params.player1Color,
                        data.params.levelNumber
                    );
                    const response = getResponse(PageState.STAGING, null, -1);
                    console.log(response);
                    io.emit("duelResponse", response);
                    break;
                case Command.GO_TO_COUNTDOWN:
                    io.emit(
                        "duelResponse",
                        getResponse(
                            PageState.COUNTDOWN,
                            null,
                            data.params.countDownValue
                        )
                    );
                    break;
                case Command.GO_TO_PLAYING:
                    io.emit(
                        "duelResponse",
                        getResponse(PageState.PLAYING, game.start(), -1)
                    );
                    break;
                case Command.GET_FRAME:
                    io.emit(
                        "duelResponse",
                        getResponse(PageState.PLAYING, game.update(), -1)
                    );
                    break;
                case Command.GO_TO_SCORING:
                    io.emit(
                        "duelResponse",
                        getResponse(PageState.SCORING, game.update(), -1)
                    );
                    break;
                default:
                    break;
            }
            break;
        default:
            switch (data.command) {
                case Command.GO_TO_COUNTDOWN:
                    switch (data.user) {
                        case 0:
                            player0Ready = true;
                            break;
                        case 1:
                            player1Ready = true;
                            break;
                    }
                    io.emit(
                        "duelResponse",
                        getResponse(PageState.STAGING, game.update(), -1)
                    );
                    break;
                case Command.UPDATE_CONTROLS:
                    break;
                default:
                    break;
            }
    }
}

function getResponse(
    state: PageState,
    blob: IGameRenderData,
    countdown: number
) {
    return {
        pageState: state,
        player1Ready: player0Ready,
        player2Ready: player1Ready,
        countDownValue: countdown,
        gameData: blob
    } as IDuelStateSocketData;
}
