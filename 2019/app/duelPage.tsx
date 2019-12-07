import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";
import { TeamColor } from "../server/api/gameRenderData";
import { Command, DuelPlayer, IDuelSocketCommand, IDuelStateSocketData, PageState } from "../server/api/levelDuelData";
import { GameApp } from "./components/game";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

// DEBUG PAGE START
const pageStart = PageState.ATTRACT;

export interface IDuelPageState extends IDuelStateSocketData { }

export class DuelPage extends React.PureComponent<{}, IDuelPageState> {
    private playerId: DuelPlayer;
    private keyStore: boolean[] = [false, false, false, false, false];

    constructor(props: any) {
        super(props);

        console.log("Initializing Duel Page");
        this.playerId = parseInt(window.location.search.replace("?", ""), 10) as DuelPlayer;
        console.log("I am player", this.playerId);

        socket.on("duelResponse", (data: IDuelStateSocketData) => {
            const formattedData = data;
            this.setState({
                ...formattedData,
            });
        });

        this.state = {
            pageState: pageStart,
        };
    }

    public componentDidMount() {
        document.addEventListener("keypress", this.gameController);
        document.addEventListener("keydown", this.gameControls);
        document.addEventListener("keyup", this.gameControlsRelease);
    }

    public componentWillUnmount() {
        document.removeEventListener("keypress", this.gameController);
        document.removeEventListener("keydown", this.gameControls);
        document.removeEventListener("keyup", this.gameControlsRelease);
    }

    public render() {
        let html;
        switch (this.state.pageState) {
            case PageState.ATTRACT:
                console.log("In Attract");
                html = <div className="attract" />;
                break;

            case PageState.STAGING:
                html = (
                    <div
                        className={`staging ${TeamColor[this.state.player1Color].toLowerCase()}-vs-${TeamColor[
                            this.state.player2Color
                        ].toLowerCase()}`}
                    >
                        <div
                            className={`ready-sign p1 p-${TeamColor[this.state.player1Color].toLowerCase()} p-${
                                this.state.player1Ready
                                }`}
                        />
                        <div
                            className={`ready-sign p2 p-${TeamColor[this.state.player2Color].toLowerCase()} p-${
                                this.state.player2Ready
                                }`}
                        />
                    </div>
                );
                console.log("In Staging");
                break;

            case PageState.COUNTDOWN:
                html = <div>countdown</div>;
                break;

            case PageState.PLAYING:
                html = (
                    <div className="container playing">
                        {this.state.gameData && (
                            <>
                                <div className="info-container">
                                    <div className={`p1 mallow-${TeamColor[this.state.gameData.imagesToRender.player1.pos.color].toLowerCase()}`}>
                                        <div className="mallow" />
                                        <div className="score-value">
                                            {this.state.gameData.imagesToRender.player1.score}
                                        </div>
                                    </div>
                                    <div className={`p2 mallow-${TeamColor[this.state.gameData.imagesToRender.player2.pos.color].toLowerCase()}`}>
                                        <div className="mallow" />
                                        <div className="score-value">
                                            {this.state.gameData.imagesToRender.player2.score}
                                        </div>
                                    </div>
                                    <div className="time">
                                        <div className="time-text">TIME</div>
                                        <div className="time-value">
                                            <div className="time-tens">
                                                {Math.floor((this.state.gameData.timeLeft / 10) % 10)}
                                            </div>
                                            <div className="time-ones">{this.state.gameData.timeLeft % 10}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="game-canvas-container">
                                    <GameApp isDuel={true} gameData={this.state.gameData} />
                                </div>
                            </>
                        )}
                    </div>
                );
                break;

            case PageState.SCORING:
                const player1C = this.state.gameData.imagesToRender.player1;
                const player2C = this.state.gameData.imagesToRender.player2;
                let winner: string = "";

                if (player1C.score > player2C.score) {
                    winner = TeamColor[player1C.pos.color].toLowerCase();
                } else {
                    winner = TeamColor[player2C.pos.color].toLowerCase();
                }


                html = <div className={`winner winner-${winner}`} />;
                console.log("Scoring");
                break;
        }
        return html;
    }

    private gameController = (event: any) => {
        console.log("key pressed: ", event.key);
        if (event.key === " ") {
            if (this.state.pageState === PageState.STAGING) {
                const command: IDuelSocketCommand = {
                    user: this.playerId,
                    command: Command.GO_TO_COUNTDOWN,
                };
                socket.emit("duelUpdate", command);
                console.log("emitted ready");
            }
        }
    };

    private gameControls = (event: any) => {
        if (event.keyCode === 38 || event.keyCode === 87) {
            // up
            this.keyStore[0] = true;
        } else if (event.keyCode === 37 || event.keyCode === 65) {
            // left
            this.keyStore[2] = true;
        } else if (event.keyCode === 40 || event.keyCode === 83) {
            // down
            this.keyStore[1] = true;
        } else if (event.keyCode === 39 || event.keyCode === 68) {
            // right
            this.keyStore[3] = true;
        } else if (event.key === " ") {
            this.keyStore[4] = true;
        }
        this.updateKeystore();
    };

    private gameControlsRelease = (event: any) => {
        if (event.keyCode === 38 || event.keyCode === 87) {
            // up
            this.keyStore[0] = false;
        } else if (event.keyCode === 37 || event.keyCode === 65) {
            // left
            this.keyStore[2] = false;
        } else if (event.keyCode === 40 || event.keyCode === 83) {
            // down
            this.keyStore[1] = false;
        } else if (event.keyCode === 39 || event.keyCode === 68) {
            // right
            this.keyStore[3] = false;
        } else if (event.key === " ") {
            this.keyStore[4] = false;
        }
        this.updateKeystore();
    };

    private updateKeystore = () => {
        socket.emit("duelUpdate", {
            user: this.playerId,
            command: Command.UPDATE_CONTROLS,
            params: {
                controls: this.keyStore,
            },
        });
    };
}

ReactDOM.render(<DuelPage />, document.getElementById("duel-content"));
