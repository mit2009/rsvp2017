"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var game_1 = require("../utils/game");
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
        var game = new game_1.Game();
        memory[user] = game;
        res.json(game.getBlob());
    });
    router.post("/update", function (_req, res) {
        var _a = _req.body, user = _a.user, left = _a.left, right = _a.right, forward = _a.forward, fire = _a.fire;
        var game = memory[user];
        game.update(left, right, forward, fire);
        res.json(game.getBlob());
    });
    return router;
}
exports.getRouter = getRouter;
//# sourceMappingURL=stadia.js.map