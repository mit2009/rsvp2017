import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";
import { IGameRenderData } from "../server/api/gameRenderData";
import { GameApp } from "./components/game";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

export enum PageState {
    ATTRACT,
    STAGING,
    COUNTDOWN,
    PLAYING,
    SCORING,
}

export interface IDuelStateSocketData {
    pageState: PageState;
    player1Ready?: boolean;
    player2Ready?: boolean;
    gameData?: IGameRenderData;
}

export interface IDuelPageState extends IDuelStateSocketData { }

export class DuelPage extends React.PureComponent<{}, IDuelPageState> {
    private playerId: number;

    constructor(props: any) {
        super(props);

        console.log("Initializing Duel Page");
        this.playerId = parseInt(window.location.search.replace("?", ""), 10);
        console.log("I am player", this.playerId);

        socket.on("levelUpdate", (data: any) => {
            console.log(data);
        });

        socket.on("stateChange", (data: any) => {
            const formattedData = JSON.parse(data) as IDuelStateSocketData;
            this.setState({
                ...formattedData,
            });
        });

        this.state = {
            pageState: PageState.STAGING,
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
                socket.emit("ready", { playerId: this.playerId });
                console.log("emitted ready");
            }
        }
    };
}

ReactDOM.render(<DuelPage />, document.getElementById("duel-content"));
