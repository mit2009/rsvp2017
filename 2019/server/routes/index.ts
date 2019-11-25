import * as express from "express";
import * as gameHandler from "../utils/gameHandler"
import { getLeaderboard } from "../utils/leaderboard";
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

        res.send(gameHandler.newGame());

    });

    router.post("/game/team", (_req: express.Request, res: express.Response) => {
        const {guid, teamColor} = _req.body;
        // console.log(_req.body);
        const success = gameHandler.changeTeam(guid, teamColor);
        res.json({success});
    });

    router.post("/game/playername", (_req: express.Request, res: express.Response) => {

    });

    router.get("/game/leaderboard", (_req: express.Request, res: express.Response) => {
        res.json(getLeaderboard());
    });

    router.post("/game/team", (_req: express.Request, res: express.Response) => {
        const { guid, teamColor } = _req.body;
        const success = gameHandler.changeTeam(guid, teamColor);
        res.json({success});
    });
    //
    // router.post("/game/playername", (_req: express.Request, res: express.Response) => {
    //
    // });
    //
    // router.get("/game/leaderoard", (_req: express.Request, res: express.Response) => {
    //     return {
    //         leaderoard: [
    //
    //         ]
    //     }
    // });

    return router;
}
