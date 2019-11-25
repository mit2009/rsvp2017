"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var http = require("http");
var path = require("path");
var index_1 = require("./routes/index");
var stadia_1 = require("./routes/stadia");
var leaderboard_1 = require("./utils/leaderboard");
var gameRenderData_1 = require("./api/gameRenderData");
var app = express();
// testing leaderboards;
console.log("leaderboards test");
leaderboard_1.saveScore({
    team: gameRenderData_1.TeamColor,
    name: "Mallow mallw",
    score: 5800,
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/stadia", stadia_1.getRouter());
app.use("/", index_1.getRouter());
// catch 404 and forward to error handler
app.use(function (req, _res, next) {
    var err = new Error("Not Found: " + req.originalUrl);
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
var port = normalizePort(process.env.PORT || "8001");
app.set("port", port);
// Until there is a favicon in place
app.get("/favicon.ico", function (_req, res) { return res.status(204); });
var server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    // tslint:disable-next-line:no-shadowed-variable
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.info("Listening on port", bind);
}
//# sourceMappingURL=server.js.map