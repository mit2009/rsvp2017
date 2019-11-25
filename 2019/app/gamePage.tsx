import * as React from "react";
import * as ReactDOM from "react-dom";

import axios from "axios";

import { TeamColor, IGameRenderData } from "../server/api/gameRenderData";
import { ILeaderboardScore } from "../server/utils/leaderboard";
import { GameApp } from "./components/game";

import * as socketio from "socket.io-client";

enum GameState {
    ATTRACT,
    CHOOSE_CHARACTER,
    STAGING,
    PLAYING,
    INSTRUCTIONS,
    NAME_COLLECTION,
    RECAPITULATE,
    ERROR,
}

export interface IGamePageState {
    gameState: GameState;
    level: number;
    gameData?: IGameRenderData;
    leaderboard?: ILeaderboardScore[];
    guid?: string;
    nameValue: string;
    score: number;
}

export class GamePage extends React.PureComponent<{}, IGamePageState> {
    private socket: SocketIOClient.Socket;

    constructor(props: any) {
        super(props);
        this.socket = socketio("http://localhost:8001");

        this.socket.on("levelUpdate", (data: any) => {
            console.log("levelupdate");
            this.setState({
                gameData: JSON.parse(data) as IGameRenderData,
            });
        });

        this.socket.on("levelData", (data: any) => {
            console.log("levelData");
            this.setState({
                gameData: JSON.parse(data) as IGameRenderData,
            });
        });

        this.state = {
            gameState: GameState.ATTRACT,
            level: 1,
            nameValue: "",
            score: 0,
        };
        axios
            .get("game/leaderboard")
            .then(res => {
                this.setState({
                    leaderboard: res.data,
                });
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    public render() {
        console.log(this.socket);

        let html = <div>Loading...</div>;
        switch (this.state.gameState) {
            case GameState.ATTRACT:
                html = (
                    <div>
                        <h1>Intro Page!</h1>
                        <div>{JSON.stringify(this.state.leaderboard)}</div>
                        <button onClick={this.handleEnterGame} className="play-btn">
                            Play!
                        </button>
                        <button
                            onClick={() => {
                                console.log("page click!");
                                this.setState({
                                    gameState: GameState.INSTRUCTIONS,
                                });
                            }}
                            className="instructions-btn"
                        >
                            Instructions!
                        </button>
                    </div>
                );
                break;
            case GameState.CHOOSE_CHARACTER:
                html = (
                    <div>
                        <h1>choose your character</h1>
                        <div onClick={this.handleCharacterSelect(TeamColor.BLUE)}>blue</div>
                    </div>
                );
                break;
            case GameState.STAGING:
                html = (
                    <div>
                        <h1>ready for level {this.state.level}</h1>
                        <button onClick={this.handleStart}>Start Level (or hit enter)</button>
                    </div>
                );
                break;
            case GameState.NAME_COLLECTION:
                html = (
                    <div>
                        <h1>you died</h1>
                        <h2>your final score</h2>
                        <input
                            placeholder="Nickname"
                            type="text"
                            value={this.state.nameValue}
                            onChange={this.handleNameChange}
                        />
                        <button onClick={this.handleNameSubmit}>Submit</button>
                    </div>
                );
                break;
            case GameState.RECAPITULATE:
                html = (
                    <div>
                        <h1>you died</h1>
                        <h2>your final score</h2>
                        <p>{JSON.stringify(this.state.leaderboard)}</p>
                        <p>{this.state.score}</p>
                        <button onClick={this.handleRestart}>Restart</button>
                    </div>
                );
                break;
            case GameState.INSTRUCTIONS:
                html = (
                    <div>
                        <h1>Instructions!</h1>
                        <button
                            onClick={() => {
                                console.log("page click!");
                                this.setState({
                                    gameState: GameState.ATTRACT,
                                });
                            }}
                            className="play-btn"
                        >
                            Back!
                        </button>
                    </div>
                );
                break;
            case GameState.PLAYING:
                html = (
                    <div>
                        <GameApp gameData={this.state.gameData} />
                    </div>
                );
                break;
            default:
                html = <div>Error! Please refresh the page.</div>;
        }
        return html;
    }

    private handleRestart = () => {
        this.setState({
            gameState: GameState.STAGING,
        });
    };

    private handleNameChange(event: any) {
        const nameValue = event.target.value.replace(/[^A-Za-z0-9]/g, "");

        this.setState({
            nameValue,
        });
    }

    private handleEnterGame = () => {
        // post to server, store token in state
        console.log("HEY");

        axios
            .post("/game/start")
            .then((res: any) => {
                console.log(res);

                this.setState({
                    guid: res.data.guid,
                    gameState: GameState.CHOOSE_CHARACTER,
                });
            })
            .catch((err: any) => console.log(err));
    };

    private handleStart = () => {
        // starts the game
        this.socket.emit("levelUp", this.state.guid);

        setInterval(() => {
            this.socket.emit("getUpdate", this.state.guid, true, false, false, false, false);
        }, 500);

        this.setState({
            gameState: GameState.PLAYING,
        });
    };

    private handleNameSubmit = () => {
        // starts the game
        console.log("hello");
        axios
            .post("/game/playername", { playerName: this.state.nameValue })
            .then((res: any) => {
                console.log(res);

                this.setState({
                    leaderboard: res.data.leaderboard,
                    score: res.data.score,
                    gameState: GameState.RECAPITULATE,
                });
            })
            .catch((err: any) => console.log(err));
    };

    private handleCharacterSelect(color: TeamColor) {
        return () => {
            console.log("submitting team color ", color);

            axios
                .post("/game/team", {
                    teamColor: color,
                    guid: this.state.guid,
                })
                .then((res: any) => {
                    console.log(res);

                    this.setState({
                        gameState: GameState.STAGING,
                    });
                })
                .catch((err: any) => console.log(err));
        };
    }
}

ReactDOM.render(<GamePage />, document.getElementById("game-content"));
