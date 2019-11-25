"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameRenderData_1 = require("../api/gameRenderData");
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
        // console.log(_req.body);
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
        var finalScore = Math.floor(Math.random() * 10000);
        console.log(guid);
        leaderboard_1.saveScore({
            team: gameRenderData_1.TeamColor.BLUE,
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