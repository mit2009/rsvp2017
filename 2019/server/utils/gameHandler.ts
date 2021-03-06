import { Guid } from "guid-typescript"
import { Game } from "./game";
import { TeamColor} from "../api/gameRenderData";


const gameDoesNotExistResponse = {
    error: 'Game does not exist'
}

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
    if (games.hasOwnProperty(guid)) {
        return games[guid].changeTeam(team);
    }
    return false;
}

export function levelUp(guid: string) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].levelUp();
    }
    return gameDoesNotExistResponse;
}

export function update(guid: string, up: boolean, down: boolean, left: boolean, right: boolean, fire: boolean) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].update(up, down, left, right, fire);
    }
    return gameDoesNotExistResponse;
}

export function getScore(guid: string) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].getScore();
    }
    return -1;
}

export function getColor(guid: string) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].getColor();
    }
    return -1;
}
