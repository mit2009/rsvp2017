"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fileLocation = "storage/leaderboard.json";
// saves the score to our high tech database
function saveScore(score) {
    var scores = getLeaderboard();
    // TODO: Duplicate Score Detection
    // If players have both the same name and score, don't bother adding it
    // That will save the tiny bits of space we have.
    scores.push(score);
    scores.sort(function (a, b) {
        return b.score - a.score;
    });
    var result = fs.writeFileSync(fileLocation, JSON.stringify({ leaderboard: scores }));
    console.log(result);
    return scores;
}
exports.saveScore = saveScore;
// fetches the leaderboard, given a limit of results to retunr
// default is all
function getLeaderboard() {
    var contents = fs.readFileSync(fileLocation);
    var scores = JSON.parse(contents.toString()).leaderboard;
    return scores;
}
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=leaderboard.js.map