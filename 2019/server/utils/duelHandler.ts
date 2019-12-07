import { IGameRenderData } from "../api/gameRenderData";
import {
  Command,
  IDuelSocketCommand,
  IDuelStateSocketData,
  PageState
} from "../api/levelDuelData";
import { Duel } from "./duel";

// let game: Duel = null;
let game: Duel = new Duel(0, 1, 1);
let player0Ready = false;
let player1Ready = false;
let resp = null;

export function update(data: IDuelSocketCommand, io: any) {
  // console.log("This is DATA:", data);

  resp = null;
  switch (data.user) {
    case -1:
      switch (data.command) {
        case Command.RESET_TO_ATTRACT:
          game = null;
          player0Ready = false;
          player1Ready = false;
          resp = getResponse(PageState.ATTRACT, null, -1, data);
          break;
        case Command.GO_TO_STAGING:
          game = new Duel(
            data.params.player0Color,
            data.params.player1Color,
            data.params.levelNumber
          );
          resp = getResponse(PageState.STAGING, null, -1, data);
          break;
        case Command.GO_TO_COUNTDOWN:
          resp = getResponse(
            PageState.COUNTDOWN,
            null,
            data.params.countDownValue,
            data
          );
          break;
        case Command.GO_TO_PLAYING:
          if (game != null) {
            resp = getResponse(PageState.PLAYING, game.start(), -1, data);
          }
          break;
        case Command.GET_FRAME:
          if (game != null) {
            const frame = game.update();
            if (frame.done) {
              resp = getResponse(PageState.PLAYING, frame.blob, -1, data);
              resp = getResponse(PageState.SCORING, frame.blob, -1, data);
            } else {
              resp = getResponse(PageState.PLAYING, frame.blob, -1, data);
            }
          }
          break;
        case Command.GO_TO_SCORING:
          if (game != null) {
            resp = getResponse(
              PageState.SCORING,
              game.update(true).blob,
              -1,
              data
            );
          }
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
              if (player0Ready == false) {
                  player0Ready = true;
                  resp = getResponse(PageState.STAGING, null, -1, data);
              }
              break;
            case 1:
              if (player1Ready == false) {
                  player1Ready = true;
                  resp = getResponse(PageState.STAGING, null, -1, data);
              }
              break;
          }
          break;
        case Command.UPDATE_CONTROLS:
          if (game != null) {
            game.updateControl(data.user, data.params.controls);
          }
          break;
        default:
          break;
      }
  }
  // console.log("This is a response:", resp);
  if (resp != null) {
    io.emit("duelResponse", resp);
  }
}

function getResponse(
  state: PageState,
  blob: IGameRenderData,
  countdown: number,
  data: IDuelSocketCommand
) {
  return {
    pageState: state,
    player1Ready: player0Ready,
    player2Ready: player1Ready,
    player1Color: data.params ? data.params.player0Color : undefined,
    player2Color: data.params ? data.params.player1Color : undefined,
    countDownValue: countdown,
    gameData: blob
  } as IDuelStateSocketData;
}
