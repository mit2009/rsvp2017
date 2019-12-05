import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";
import { IGameRenderData } from "../server/api/gameRenderData";
import {
    Command,
    DuelPlayer,
    IDuelSocketCommand,
    IDuelStateSocketData,
    PageState
} from "../server/api/levelDuelData";
import { GameApp } from "./components/game";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

// DEBUG PAGE START
const pageStart = PageState.ATTRACT;

export interface IDuelPageState extends IDuelStateSocketData { }

export class DuelPage extends React.PureComponent<{}, IDuelPageState> {
    private playerId: DuelPlayer;

    constructor(props: any) {
        super(props);

        console.log("Initializing Duel Page");
        this.playerId = parseInt(
            window.location.search.replace("?", ""),
            10
        ) as DuelPlayer;
        console.log("I am player", this.playerId);

        socket.on("levelUpdate", (data: any) => {
            console.log(data);
        });

        socket.on("duelResponse", (data: any) => {
            console.log(data);
            const formattedData = data;
            this.setState({
                ...formattedData
            });
        });

        this.state = {
            pageState: pageStart
        };
    }

    public componentDidMount() {
        document.addEventListener("keypress", this.gameController);
    }

    public componentWillUnmount() {
        document.removeEventListener("keypress", this.gameController);
    }

    public render() {
        let html;
        switch (this.state.pageState) {
            case PageState.ATTRACT:
                console.log("In Attract");
                html = <div className="attract">attract</div>;
                break;

            case PageState.STAGING:
                html = (
                    <div className="staging">
                        <div>staging</div>
                        <div>
                            {this.state.player1Ready}
                            <div>Press the button...</div>
                        </div>
                        <div>
                            {this.state.player2Ready}
                            <div>Press the button...</div>
                        </div>
                    </div>
                );
                console.log("In Staging");
                break;

            case PageState.PLAYING:
                html = <GameApp gameData={this.state.gameData} />;
                console.log("In Playing");
                break;

            case PageState.SCORING:
                html = <div>scoring</div>;
                console.log("Scoring");
                break;
        }
        return <div>{html}</div>;
    }

    private gameController = (event: any) => {
        console.log("key pressed: ", event.key);
        if (event.key === " ") {
            if (this.state.pageState === PageState.STAGING) {
                const command: IDuelSocketCommand = {
                    user: this.playerId,
                    command: Command.GO_TO_COUNTDOWN
                };
                socket.emit("duelUpdate", command);
                console.log("emitted ready");
            }
        }
    };
}

ReactDOM.render(<DuelPage />, document.getElementById("duel-content"));
