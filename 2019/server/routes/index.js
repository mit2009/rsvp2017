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
    return router;
}
exports.getRouter = getRouter;
//# sourceMappingURL=index.js.map