"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var axios_1 = require("axios");
var fileLocation = "storage/leaderboard.json";
// saves the score to our high tech database
var webhook = 'https://hooks.slack.com/services/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';
function saveScore(score, callback) {
    var scores = getLeaderboard();
    // TODO: Duplicate Score Detection
    // If players have both the same name and score, don't bother adding it
    // That will save the tiny bits of space we have.
    scores.push(score);
    scores.sort(function (a, b) {
        return b.score - a.score;
    });
    axios_1.default.post(webhook, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*" + score.name + "* at " + (scores.indexOf(score) + 1)
                },
                accessory: {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Delete",
                        emoji: true
                    },
                    value: "{\"playerName\": \"" + score.name + "\",\"password\": \"THIS IS BOAT\"}"
                }
            }
        ]
    }).then(function (res) {
        // console.log(res)
    }).catch(function (error) {
        // console.log(error)
    });
    var result = fs.writeFileSync(fileLocation, JSON.stringify({ leaderboard: scores }));
    console.log(result);
    callback(scores.slice(0, 8));
}
exports.saveScore = saveScore;
// remove a score from our high tech database
function deleteScore(name, callback) {
    var scores = getLeaderboard();
    scores.sort(function (a, b) {
        return b.score - a.score;
    });
    var counter = 0;
    scores = scores.filter(function (s) {
        if (s.name == name) {
            counter += 1;
            return false;
        }
        return true;
    });
    var result = fs.writeFileSync(fileLocation, JSON.stringify({ leaderboard: scores }));
    console.log(result);
    axios_1.default.post(webhook, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Successfully removed *" + name + "*"
                }
            }
        ]
    }).then(function (res) {
        // console.log(res)
    }).catch(function (error) {
        // console.log(error)
    });
    callback(counter);
}
exports.deleteScore = deleteScore;
// fetches the leaderboard, given a limit of results to retunr
// default is all
function getLeaderboard() {
    var contents = fs.readFileSync(fileLocation);
    var scores = JSON.parse(contents.toString()).leaderboard;
    return scores;
}
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=leaderboard.js.map