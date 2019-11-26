"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var gameHandler = require("../utils/gameHandler");
var leaderboard_1 = require("../utils/leaderboard");
var router = express.Router();
function getRouter() {
    // routes
    router.get("/", function (_req, res) {
        res.render("index", {
            layout: "layout",
            isHome: true,
        });
    });
    router.get("/webcast", function (_req, res) {
        res.render("webcast", {
            layout: "layout",
            isWebcast: true,
        });
    });
    router.get("/game", function (_req, res) {
        res.render("game", {
            layout: "layout",
            isGame: true,
        });
    });
    router.post("/game/start", function (_req, res) {
        res.json({ guid: gameHandler.newGame() });
    });
    router.post("/game/team", function (_req, res) {
        var _a = _req.body, guid = _a.guid, teamColor = _a.teamColor;
        var success = gameHandler.changeTeam(guid, teamColor);
        res.json({ success: success });
    });
    router.get("/game/leaderboard", function (_req, res) {
        res.json(leaderboard_1.getLeaderboard());
    });
    router.post("/game/team", function (_req, res) {
        var _a = _req.body, guid = _a.guid, teamColor = _a.teamColor;
        var success = gameHandler.changeTeam(guid, teamColor);
        res.json({ success: success });
    });
    router.post("/game/playername", function (_req, res) {
        // TODO: Logic here for associating the guid with the actual score
        var _a = _req.body, guid = _a.guid, playerName = _a.playerName;
        // TODO: Calculate their final score
        var finalScore = gameHandler.getScore(guid);
        var teamColor = gameHandler.getColor(guid);
        if (finalScore == -1 || teamColor == -1) {
            res.status(500).send("Invalid game for High Score");
            return;
        }
        leaderboard_1.saveScore({
            team: teamColor,
            name: playerName,
            score: finalScore,
        }, function (leaderboard) {
            res.json({ leaderboard: leaderboard, score: finalScore, success: true });
        });
    });
    return router;
}
exports.getRouter = getRouter;
//# sourceMappingURL=index.js.map