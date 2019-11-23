import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as http from "http";
import * as path from "path";

import { getRouter } from "./routes/index";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", getRouter());

// catch 404 and forward to error handler
app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    const err: any = new Error("Not Found: " + req.originalUrl);
    err.status = 404;
    next(err);
});

// error handler
app.use((err: any, req: express.Request, res: express.Response) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const port = normalizePort(process.env.PORT || "8001");
app.set("port", port);

// Until there is a favicon in place
app.get("/favicon.ico", (_req, res) => res.status(204));

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    // tslint:disable-next-line:no-shadowed-variable
    const port = parseInt(val, 10);

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

function onError(error: any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

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
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.info("Listening on port", bind);
}
