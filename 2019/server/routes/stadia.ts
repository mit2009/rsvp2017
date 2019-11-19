import * as express from "express";
const router = express.Router();

interface Memory {
    [key: string]: Player;
}

interface Player {
    lastTime:     number;
    x:            number;
    y:            number;
    heading:      number;
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

    const position = { lastTime: Date.now(), x: 350, y: 350, heading: 0 };
    memory[user] = position as Player;
    res.json(position);
  });

  router.post("/update", (_req: express.Request, res: express.Response) => {
    const { user, left, right, forward, fire } = _req.body;
    const current: Player = memory[user];
    const currentTime = Date.now();
    const timeDelta = (currentTime - current.lastTime) / 250
    // console.log(currentTime - current.lastTime);
    if (left) {
      current.heading -= 1 * timeDelta;
    }
    if (right) {
      current.heading += 1 * timeDelta;
    }
    if (forward) {
        console.log("here");
        current.x += 60 * Math.sin(current.heading) * timeDelta;
        current.y -= 60 * Math.cos(current.heading)  * timeDelta;
    }
    console.log(current.x, current.y);
    if (fire) {
    }
    current.lastTime = currentTime;
    memory[user] = current;;
    res.json(current);
  });

  return router;
}
