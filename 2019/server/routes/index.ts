import * as express from "express";
import * as gameHandler from "../utils/gameHandler";
import { getLeaderboard, ILeaderboardScore, saveScore, deleteScore } from "../utils/leaderboard";
const router = express.Router();

export function getRouter() {

    // routes

    router.get("/", (_req: express.Request, res: express.Response) => {
        res.render("index", {
            layout: "layout",
            isHome: true,
        });
    });

    router.get("/notify", (_req: express.Request, res: express.Response) => {
        res.render("notify", {
            layout: "layout-pre",
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
        const success = gameHandler.changeTeam(guid, teamColor);
        res.json({ success });
    });

    router.get("/game/leaderboard", (_req: express.Request, res: express.Response) => {
        res.json(getLeaderboard().slice(0, 30));
    });

    router.post("/game/team", (_req: express.Request, res: express.Response) => {
        const { guid, teamColor } = _req.body;
        const success = gameHandler.changeTeam(guid, teamColor);
        res.json({ success });
    });

    router.post("/game/playername", (_req: express.Request, res: express.Response) => {

        let { guid, playerName } = _req.body;
        const finalScore = gameHandler.getScore(guid);
        const teamColor = gameHandler.getColor(guid);

        if (finalScore === -1 || teamColor === -1) {
            res.status(400).send("Invalid game for High Score");
            return;
        }
        saveScore(
            {
                team: teamColor,
                name: playerName.replace(/[^A-Za-z0-9]/g, "").substring(0).toUpperCase(),
                score: finalScore,
            },
            (leaderboard: ILeaderboardScore[]) => {
                res.json({ leaderboard, score: finalScore, success: true });
            },
        );
    });

    const expectedPassword = 'THIS IS BOAT';
    router.post("/game/delete/playername", (_req: express.Request, res: express.Response) => {
        console.log(_req.body);

        let { playerName, password } = _req.body;

        if (password != expectedPassword) {
            res.status(400).send('Unallowed Operation');
            return;
        }

        deleteScore(playerName,
            (count: number) => {
                res.json({ deleted: count });
            });
    });

    router.post("/slack/delete/playername", (_req: express.Request, res: express.Response) => {
        let { playerName, password } = JSON.parse(JSON.parse(_req.body.payload).actions[0].value);
        if (password != expectedPassword) {
            res.status(400).send('Unallowed Operation');
            return;
        }
        deleteScore(playerName,
            (count: number) => {
                res.json({ deleted: count });
            });
    });

    return router;
}
