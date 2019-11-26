import * as fs from "fs";
import { TeamColor } from "../api/gameRenderData";

export interface ILeaderboardScore {
    team: TeamColor;
    name: string;
    score: number;
}

const fileLocation = "storage/leaderboard.json";

// saves the score to our high tech database

export function saveScore(score: ILeaderboardScore, callback?: (leaderboard: ILeaderboardScore[]) => void) {
    const scores = getLeaderboard();

    // TODO: Duplicate Score Detection
    // If players have both the same name and score, don't bother adding it
    // That will save the tiny bits of space we have.
    scores.push(score);
    scores.sort((a: ILeaderboardScore, b: ILeaderboardScore) => {
        return b.score - a.score;
    });

    const result = fs.writeFileSync(fileLocation, JSON.stringify({ leaderboard: scores }));

    console.log(result);
    callback(scores);

}

// fetches the leaderboard, given a limit of results to retunr
// default is all

export function getLeaderboard() {
    const contents = fs.readFileSync(fileLocation);
    const scores = JSON.parse(contents.toString()).leaderboard.subarray(0,10);
    return scores;
}
