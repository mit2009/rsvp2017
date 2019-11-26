import * as React from "react";
import * as ReactDOM from "react-dom";

import axios from "axios";

import { GameCommand, IGameRenderData, TeamColor } from "../server/api/gameRenderData";
import { ILeaderboardScore } from "../server/utils/leaderboard";
import { GameApp } from "./components/game";

import * as socketio from "socket.io-client";

const SOCKET_URL = "http://localhost:8001";

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

// DEBUG
const DEBUG = true;
const debugGameState = GameState.ATTRACT;
const debugMusicPlaying = true;

export interface IGamePageState {
    gameState: GameState;
    level: number;
    gameData?: IGameRenderData;
    leaderboard?: ILeaderboardScore[];
    guid?: string;
    nameValue: string;
    score: number;
    musicPlaying: boolean;
    enterKeyIsDown: boolean;
}

export class GamePage extends React.PureComponent<{}, IGamePageState> {
    private socket: SocketIOClient.Socket = socketio(SOCKET_URL);

    private keyStore: boolean[] = [false, false, false, false, false];
    private backgroundSoundRef: HTMLAudioElement;

    constructor(props: any) {
        super(props);

        this.socket.on("levelUpdate", (data: any) => {
            const formattedData = JSON.parse(data) as IGameRenderData;

            // TODO: factor this out into win
            if (formattedData.gameCommand === GameCommand.WIN) {
                this.setState({
                    gameState: GameState.STAGING,
                    level: formattedData.currentLevel + 1,
                });
            } else if (formattedData.gameCommand === GameCommand.FINAL_WIN || formattedData.gameCommand === GameCommand.MALLOW_DEATH) {
                this.setState({
                    gameState: GameState.NAME_COLLECTION,
                });
            } else {
                this.setState({
                    gameData: formattedData,
                });
            }
        });

        this.state = {
            gameState: !DEBUG ? GameState.ATTRACT : debugGameState,
            level: 1,
            nameValue: "",
            score: 0,
            musicPlaying: !DEBUG ? true : debugMusicPlaying,
            enterKeyIsDown: false,
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
            // this.keyStore[4] = true;
        } else if (event.key === "Enter") {
            if (this.state.enterKeyIsDown === false) {
                if (this.state.gameState === GameState.ATTRACT) {
                    this.setState(
                        {
                            enterKeyIsDown: true,
                        },
                        this.handleEnterGame,
                    );
                } else if (this.state.gameState === GameState.CHOOSE_CHARACTER) {
                    this.setState(
                        {
                            enterKeyIsDown: true,
                        },
                        this.handleCharacterSelect(TeamColor.BLUE),
                    );
                } else if (this.state.gameState === GameState.STAGING) {
                    this.setState(
                        {
                            enterKeyIsDown: true,
                        },
                        this.handleStart,
                    );
                }
            }
        }
    };

    private gameControlsShoot = (event: any) => {
        if (event.key === " ") {
            console.log("KEY DOWN!");
            this.keyStore[4] = true;
        }
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
        } else if (event.key === "Enter") {
            this.setState({
                enterKeyIsDown: false,
            });
        }
    };

    public componentDidMount() {
        document.addEventListener("keydown", this.gameControls);
        document.addEventListener("keypress", this.gameControlsShoot);
        document.addEventListener("keyup", this.gameControlsRelease);
    }
    public componentWillUnmount() {
        document.removeEventListener("keydown", this.gameControls);
        document.removeEventListener("keyup", this.gameControlsRelease);
    }
    public render() {
        let backgroundImage = "";
        let html = <div>Loading...</div>;
        switch (this.state.gameState) {
            case GameState.ATTRACT:
                const leaderboard = this.state.leaderboard ? this.state.leaderboard : [];
                backgroundImage = "attract";
                html = (
                    <div className="game-sized-container start-page">
                        {/* <div>{JSON.stringify(this.state.leaderboard)}</div> */}
                        <div className="highscores-container">
                            <h1>Highscores</h1>
                            {leaderboard.map((value, key) => {
                                return (
                                    <div key={key} className="highscore-row">
                                        <div className="score">{value.score}</div>
                                        <div className={`color color-${TeamColor[value.team].toLowerCase()}`} />
                                        <div className="name">{value.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="button-container">
                            <button onClick={this.handleEnterGame} className="big-pushy play-btn">
                                Start Game
                            </button>
                            <button
                                onClick={() => {
                                    console.log("page click!");
                                    this.setState({
                                        gameState: GameState.INSTRUCTIONS,
                                    });
                                }}
                                className="big-pushy instructions-btn"
                            >
                                Instructions
                            </button>
                        </div>
                    </div>
                );
                break;
            case GameState.CHOOSE_CHARACTER:
                backgroundImage = "choose-character";
                html = (
                    <div className="game-sized-container">
                        <h1>choose your marshmallow</h1>
                        <div className="character-container">
                            <div
                                onClick={this.handleCharacterSelect(TeamColor.ORANGE)}
                                className="mallow mallow-orange"
                            />
                            <div
                                onClick={this.handleCharacterSelect(TeamColor.PURPLE)}
                                className="mallow mallow-purple"
                            />
                            <div
                                onClick={this.handleCharacterSelect(TeamColor.SILVER)}
                                className="mallow mallow-silver"
                            />
                            <div onClick={this.handleCharacterSelect(TeamColor.BLUE)} className="mallow mallow-blue" />
                            <div
                                onClick={this.handleCharacterSelect(TeamColor.YELLOW)}
                                className="mallow mallow-yellow"
                            />
                            <div onClick={this.handleCharacterSelect(TeamColor.PINK)} className="mallow mallow-pink" />
                            <div
                                onClick={this.handleCharacterSelect(TeamColor.GREEN)}
                                className="mallow mallow-green"
                            />
                            <div onClick={this.handleCharacterSelect(TeamColor.RED)} className="mallow mallow-red" />
                        </div>
                    </div>
                );
                break;
            case GameState.STAGING:
                backgroundImage = "staging";
                html = (
                    <div className="game-sized-container">
                        <div>
                            <h1>ready for <em>level {this.state.level}</em>?</h1>
                            <div className="button-container">
                                <div>
                                    <button className="big-pushy" onClick={this.handleStart}>Start Level</button>
                                </div>
                            </div>
                            <div className="hit-enter">(Or hit enter)</div>
                        </div>
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
                    <div className="playing">
                        <GameApp gameData={this.state.gameData} />
                    </div>
                );
                break;
            default:
                html = <div>Error! Please refresh the page.</div>;
        }

        return (
            <div className={`background-container ${backgroundImage}`}>
                {html}
                <audio
                    ref={input => {
                        this.backgroundSoundRef = input;
                    }}
                    src={"/sounds/background-sound.mp3"}
                    autoPlay
                />
            </div>
        );
    }

    private handleRestart = () => {
        this.setState({
            gameState: GameState.STAGING,
        });
    };

    private handleNameChange(event: any) {
        const nameValue = event.target.value.replace(/[^A-Za-z0-9]/g, "").substring(0, 20);
        this.setState({
            nameValue,
        });
    }

    private handleEnterGame = () => {
        // post to server, store token in state
        console.log("Starting Game. Exciting!");
        // this.backgroundSoundRef.pause();

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
            if (this.state.gameState === GameState.PLAYING) {
                this.socket.emit("getUpdate", this.state.guid, ...this.keyStore);
                this.keyStore[4] = false;
            }
        }, 80);

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
                    gameState: GameState.ATTRACT,
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
