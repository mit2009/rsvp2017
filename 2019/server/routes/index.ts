import { TeamColor } from "../api/gameRenderData";

import * as express from "express";
import * as gameHandler from "../utils/gameHandler";
import { getLeaderboard, ILeaderboardScore, saveScore } from "../utils/leaderboard";
const router = express.Router();

export function getRouter() {

    // routes

    router.get("/", (_req: express.Request, res: express.Response) => {
        res.render("index", {
            layout: "layout",
            isHome: true,
        });
    });

    router.get("/webcast", (_req: express.Request, res: express.Response) => {
        res.render("webcast", {
            layout: "layout",
            isWebcast: true,
        });
    });

    router.get("/game", (_req: express.Request, res: express.Response) => {
        res.render("game", {
            layout: "layout",
            isGame: true,
        });
    });

    router.post("/game/start", (_req: express.Request, res: express.Response) => {
        res.json({ guid: gameHandler.newGame() });
    });

    router.post("/game/team", (_req: express.Request, res: express.Response) => {
        const { guid, teamColor } = _req.body;
        // console.log(_req.body);
        const success = gameHandler.changeTeam(guid, teamColor);
        res.json({ success });
    });

    router.get("/game/leaderboard", (_req: express.Request, res: express.Response) => {
        res.json(getLeaderboard());
    });

    router.post("/game/team", (_req: express.Request, res: express.Response) => {
        const { guid, teamColor } = _req.body;
        const success = gameHandler.changeTeam(guid, teamColor);
        res.json({ success });
    });

    router.post("/game/playername", (_req: express.Request, res: express.Response) => {

        // TODO: Logic here for associating the guid with the actual score
        const { guid, playerName } = _req.body;

        // TODO: Calculate their final score
        const finalScore = gameHandler.getScore(guid);
        const teamColor = gameHandler.getColor(guid);
        if (finalScore == -1 || teamColor == -1) {
            res.status(500).send("Invalid game for High Score");
            return;
        }
        saveScore(
            {
                team: teamColor,
                name: playerName,
                score: finalScore,
            },
            (leaderboard: ILeaderboardScore[]) => {
                res.json({ leaderboard, score: finalScore, success: true });
            },
        );
    });

    return router;
}
