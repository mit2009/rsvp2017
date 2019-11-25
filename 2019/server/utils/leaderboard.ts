import * as fs from "fs";
import { TeamColor } from "../api/gameRenderData";

export interface ILeaderboardScore {
    team: TeamColor;
    name: string;
    score: number;
}

// saves the score to our high tech database

export function saveScore(score: ILeaderboardScore) {
    fs.readFile("storage/leaderboard.json", (_err: any, contents: any) => {
        const scores = JSON.parse(contents.toString()).leaderboard;
        scores.push(score);
        scores.sort((a: ILeaderboardScore, b: ILeaderboardScore) => {
            return a.score - b.score;
        });

        return scores;
    });
}

// fetches the leaderboard, given a limit of results to retunr
// default is 10

export function getLeaderboard(limit?: number) {
    if (limit === undefined) {
        limit = 10;
    }
}
