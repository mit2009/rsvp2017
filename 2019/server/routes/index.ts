import * as express from "express";
const router = express.Router();

export function getRouter() {
    // routes

    router.get("/", (_req: express.Request, res: express.Response) => {
        res.render("index", {
            layout: "layout",
        });
    });

    router.get("/webcast", (_req: express.Request, res: express.Response) => {
        res.render("webcast", {
            layout: "layout",
        });
    });

    router.get("/game", (_req: express.Request, res: express.Response) => {
        res.render("game", {
            layout: "layout",
        });
    });

    return router;
}
