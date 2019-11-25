import * as express from "express";
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
        
    });

    router.post("/game/team", (_req: express.Request, res: express.Response) => {

    });

    router.post("/game/playername", (_req: express.Request, res: express.Response) => {

    });

    router.get("/game/leaderoard", (_req: express.Request, res: express.Response) => {
        return {
            leaderoard: [

            ]
        }
    });

    return router;
}
