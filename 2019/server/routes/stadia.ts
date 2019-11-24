import * as express from "express";
const router = express.Router();

import { Game } from "../utils/game";

interface Memory {
    [key: string]: Game;
}

export function getRouter() {
  const memory: Memory = {};

  // routes
  router.get("/", (_req: express.Request, res: express.Response) => {
    res.render("stadia", {
      layout: "layout"
    });
  });

  router.post("/new", (_req: express.Request, res: express.Response) => {
    const { user } = _req.body;

    const game = new Game();
    memory[user] = game;
    res.json(game.getBlob());
  });

  router.post("/update", (_req: express.Request, res: express.Response) => {
    const { user, left, right, forward, fire } = _req.body;
    const game: Game = memory[user];

    game.update(left, right, forward, fire);
    res.json(game.getBlob());
  });

  return router;
}
