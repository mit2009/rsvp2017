import { Guid } from "guid-typescript"
import { Game } from "./game";
import { TeamColor} from "../api/gameRenderData";

interface Memory {
    [key: string]: Game;
}

const games: Memory = {}

export function newGame() {
    const guid = Guid.raw();
    const game = new Game();

    games[guid] = game;

    return guid;
}

export function changeTeam(guid: string, team: TeamColor) {
    console.log(games);
    console.log(guid);
    console.log(games.hasOwnProperty(guid));
    if (games.hasOwnProperty(guid)) {
        return games[guid].changeTeam(team);
    }
    return false;
}
