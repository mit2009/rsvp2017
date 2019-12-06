import { Duel } from "./duel";
import { IGameRenderData } from "../api/gameRenderData";
import {
    Command,
    IDuelSocketCommand,
    PageState,
    IDuelStateSocketData
} from "../api/levelDuelData";

// let game: Duel = null;
let game: Duel = new Duel(0, 1, 1);
let player0Ready = false;
let player1Ready = false;
let resp = null;

export function update(data: IDuelSocketCommand, io: any) {
    console.log("This is DATA:", data);
    resp = null;
    switch (data.user) {
        case -1:
            switch (data.command) {
                case Command.RESET_TO_ATTRACT:
                    game = null;
                    resp = getResponse(PageState.ATTRACT, null, -1);
                    break;
                case Command.GO_TO_STAGING:
                    console.log("HERE");
                    game = new Duel(
                        data.params.player0Color,
                        data.params.player1Color,
                        data.params.levelNumber
                    );
                    resp = getResponse(PageState.STAGING, null, -1);
                    break;
                case Command.GO_TO_COUNTDOWN:
                    resp = getResponse(
                        PageState.COUNTDOWN,
                        null,
                        data.params.countDownValue
                    );
                    break;
                case Command.GO_TO_PLAYING:
                    resp = getResponse(PageState.PLAYING, game.start(), -1);
                    break;
                case Command.GET_FRAME:
                    resp = getResponse(PageState.PLAYING, game.update(), -1);
                    break;
                case Command.GO_TO_SCORING:
                    resp = getResponse(PageState.SCORING, game.update(), -1);
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
                    resp = getResponse(PageState.STAGING, null, -1);
                    break;
                case Command.UPDATE_CONTROLS:
                    game.updateControl(data.user, data.params.controls);
                    break;
                default:
                    break;
            }
    }
    console.log("This is a response:", resp);
    if (resp != null) {
        io.emit("duelResponse", resp);
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
