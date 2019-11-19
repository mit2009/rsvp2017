"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
function getRouter() {
    var memory = {};
    // routes
    router.get("/", function (_req, res) {
        res.render("stadia", {
            layout: "layout"
        });
    });
    router.post("/new", function (_req, res) {
        var user = _req.body.user;
        var position = { lastTime: Date.now(), x: 350, y: 350, heading: 0 };
        memory[user] = position;
        res.json(position);
    });
    router.post("/update", function (_req, res) {
        var _a = _req.body, user = _a.user, left = _a.left, right = _a.right, forward = _a.forward, fire = _a.fire;
        var current = memory[user];
        var currentTime = Date.now();
        var timeDelta = (currentTime - current.lastTime) / 250;
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
            current.y -= 60 * Math.cos(current.heading) * timeDelta;
        }
        console.log(current.x, current.y);
        if (fire) {
        }
        current.lastTime = currentTime;
        memory[user] = current;
        ;
        res.json(current);
    });
    return router;
}
exports.getRouter = getRouter;
//# sourceMappingURL=stadia.js.map