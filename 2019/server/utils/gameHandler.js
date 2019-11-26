"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_typescript_1 = require("guid-typescript");
var game_1 = require("./game");
var gameDoesNotExistResponse = {
    error: 'Game does not exist'
};
var games = {};
function newGame() {
    var guid = guid_typescript_1.Guid.raw();
    var game = new game_1.Game();
    games[guid] = game;
    return guid;
}
exports.newGame = newGame;
function changeTeam(guid, team) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].changeTeam(team);
    }
    return false;
}
exports.changeTeam = changeTeam;
function levelUp(guid) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].levelUp();
    }
    return gameDoesNotExistResponse;
}
exports.levelUp = levelUp;
function update(guid, up, down, left, right, fire) {
    if (games.hasOwnProperty(guid)) {
        return games[guid].update(up, down, left, right, fire);
    }
    return gameDoesNotExistResponse;
}
exports.update = update;
//# sourceMappingURL=gameHandler.js.map