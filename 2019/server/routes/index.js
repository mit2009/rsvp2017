"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
function getRouter() {
    // routes
    router.get("/", function (_req, res) {
        res.render("index", {
            layout: "layout",
        });
    });
    router.get("/webcast", function (_req, res) {
        res.render("webcast", {
            layout: "layout",
        });
    });
    router.get("/game", function (_req, res) {
        res.render("game", {
            layout: "layout",
        });
    });
    return router;
}
exports.getRouter = getRouter;
//# sourceMappingURL=index.js.map