"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// saves the score to our high tech database
function saveScore(score) {
    fs.readFile("storage/leaderboard.json", function (_err, contents) {
        var scores = JSON.parse(contents.toString()).leaderboard;
        scores.push(score);
        scores.sort(function (a, b) {
            return a.score - b.score;
        });
        return scores;
    });
}
exports.saveScore = saveScore;
// fetches the leaderboard, given a limit of results to retunr
// default is 10
function getLeaderboard(limit) {
    if (limit === undefined) {
        limit = 10;
    }
}
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=leaderboard.js.map