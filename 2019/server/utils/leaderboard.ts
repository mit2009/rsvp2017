import axios from "axios";
import * as fs from "fs";
import { TeamColor } from "../api/gameRenderData";
export interface ILeaderboardScore {
    team: TeamColor;
    name: string;
    score: number;
}
const fileLocation = "storage/leaderboard.json";
// saves the score to our high tech database

const webhook = "https://hooks.slack.com/services/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";
export function saveScore(score: ILeaderboardScore, callback?: (leaderboard: ILeaderboardScore[]) => void) {
    const scores = getLeaderboard();
    // TODO: Duplicate Score Detection
    // If players have both the same name and score, don't bother adding it
    // That will save the tiny bits of space we have.
    scores.push(score);
    scores.sort((a: ILeaderboardScore, b: ILeaderboardScore) => {
        return b.score - a.score;
    });
    axios
        .post(webhook, {
            text: `${score.name} at ${scores.indexOf(score) + 1} (${score})`,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*${score.name}* at ${scores.indexOf(score) + 1} (${score})`,
                    },
                    accessory: {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Delete",
                            emoji: true,
                        },
                        value: `{"playerName": "${score.name}","password": "THIS IS BOAT"}`,
                    },
                },
            ],
        })
        .then(res => {
            // console.log(res)
        })
        .catch(error => {
            // console.log(error)
        });
    const result = fs.writeFileSync(fileLocation, JSON.stringify({ leaderboard: scores }));
    console.log(result);
    callback(scores.slice(0, 30));
}
// remove a score from our high tech database
export function deleteScore(name: string, callback?: (count: number) => void) {
    let scores = getLeaderboard();
    scores.sort((a: ILeaderboardScore, b: ILeaderboardScore) => {
        return b.score - a.score;
    });
    let counter = 0;
    scores = scores.filter((s: ILeaderboardScore) => {
        if (s.name == name) {
            counter += 1;
            return false;
        }
        return true;
    });
    const result = fs.writeFileSync(fileLocation, JSON.stringify({ leaderboard: scores }));
    console.log(result);
    axios
        .post(webhook, {
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `Successfully removed *${name}*`,
                    },
                },
            ],
        })
        .then(res => {
            // console.log(res)
        })
        .catch(error => {
            // console.log(error)
        });
    callback(counter);
}
// fetches the leaderboard, given a limit of results to retunr
// default is all
export function getLeaderboard() {
    const contents = fs.readFileSync(fileLocation);
    const scores = JSON.parse(contents.toString()).leaderboard;
    return scores;
}
