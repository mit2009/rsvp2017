import * as $ from "jQuery";
import * as React from "react";
import * as ReactDOM from "react-dom";

import axios from "axios";
// @ts-ignore
import UIfx from "uifx";


const selectionFx = new UIfx("/sounds/selection.mp3", {
    volume: 1,
});
const closeFx = new UIfx("/sounds/close.mp3", {
    volume: 1,
});

import { GameCommand, IGameRenderData, TeamColor } from "../server/api/gameRenderData";
import { ILeaderboardScore } from "../server/utils/leaderboard";
import { GameApp } from "./components/game";

import { socketIp } from "../config";
import * as socketio from "socket.io-client";

const SOCKET_URL = socketIp;

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
    finalMessage: string;
}

export class GamePage extends React.PureComponent<{}, IGamePageState> {
    private socket: SocketIOClient.Socket = socketio(SOCKET_URL);

    private keyStore: boolean[] = [false, false, false, false, false];

    private timer: NodeJS.Timer;
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
            } else if (formattedData.gameCommand === GameCommand.FINAL_WIN) {
                this.setState({
                    finalMessage: "you win",
                    gameState: GameState.NAME_COLLECTION,
                    score: formattedData.score,
                });
            } else if (formattedData.gameCommand === GameCommand.MALLOW_DEATH) {
                this.setState({
                    finalMessage: "game over",
                    gameState: GameState.NAME_COLLECTION,
                    score: formattedData.score,
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
            finalMessage: "game over",
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
                } else if (this.state.gameState === GameState.NAME_COLLECTION) {
                    this.handleNameSubmit();
                }
            }
        }
    };

    private calcOctant(fingerX: number, fingerY: number, centerX: number, centerY: number) {
        const threshold = 100;
        const deltaX = fingerX - centerX;
        const deltaY = fingerY - centerY;
        if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(threshold, 2)) {
            const angle = Math.atan2(deltaX, deltaY);
            const adjustAngle = angle + 2 * Math.PI + Math.PI / 8;
            const section = Math.floor(adjustAngle / (Math.PI / 4) % 8);
            return section;
        }
        return -1;
    }

    private gameControlsGoodbye = (e: any) => {

        this.keyStore[0] = false;
        this.keyStore[1] = false;
        this.keyStore[2] = false;
        this.keyStore[3] = false;
    }
    private gameControlsMobile = (e: any) => {
        // Cache the client X/Y coordinates
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const oct = this.calcOctant(clientX, clientY, $(".mobile-control").offset().left + $(".mobile-control").width() / 2, $(".mobile-control").offset().top + $(".mobile-control").height() / 2);

        e.preventDefault();

        this.keyStore[0] = false;
        this.keyStore[1] = false;
        this.keyStore[2] = false;
        this.keyStore[3] = false;

        switch (oct) {
            case 4:
                this.keyStore[0] = true;
                break;
            case 5:
                this.keyStore[2] = true;
                this.keyStore[0] = true;
                break;
            case 6:
                this.keyStore[2] = true;
                break;
            case 7:
                this.keyStore[1] = true;
                this.keyStore[2] = true;
                break;
            case 0:
                this.keyStore[1] = true;
                break;
            case 1:
                this.keyStore[3] = true;
                this.keyStore[1] = true;
                break;
            case 2:
                this.keyStore[3] = true;
                break;
            case 3:
                this.keyStore[0] = true;
                this.keyStore[3] = true;
                break;

        }
    };

    private gameControlsShoot = (event: any) => {
        if (event.key === " ") {
            this.keyStore[4] = true;
        }
    };

    private gameControlsFire = () => {
        this.keyStore[4] = true;
    };
    private gameControlsUnfire = () => {
        this.keyStore[4] = false;
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
        document.addEventListener("touchmove", this.gameControlsMobile, false);
        document.addEventListener("touchstart", this.gameControlsMobile, false);
        document.addEventListener("touchend", this.gameControlsGoodbye, false);
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.gameControls);
        document.removeEventListener("keyup", this.gameControlsRelease);
        document.removeEventListener("touchmove", this.gameControlsMobile);
        document.removeEventListener("touchend", this.gameControlsGoodbye);
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
                        <div className="highscores-main-container">
                            <h1>Highscores</h1>
                            <div className="highscores-scroll-content">
                                <div className="highscores-container">
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
                            </div>
                        </div>
                        <div className="button-container">
                            <button onClick={this.handleEnterGame} className="big-pushy play-btn">
                                Start Game
                                </button>
                            <button
                                onClick={() => {
                                    selectionFx.play();
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
                        <h1>
                            ready for <em>level {this.state.level}</em>?
                        </h1>
                        <div className="button-container">
                            <div>
                                <button className="big-pushy" onClick={this.handleStart}>
                                    Start Level
                                </button>
                            </div>
                        </div>
                        <div className="hit-enter">(Or hit enter)</div>
                    </div>
                );
                break;
            case GameState.NAME_COLLECTION:
                backgroundImage = "name-collection";
                html = (
                    <div className="game-sized-container">
                        <h1>{this.state.finalMessage}</h1>
                        <h2>{this.state.score}</h2>
                        <div className="input-section">
                            <input
                                placeholder="Nickname"
                                type="text"
                                value={this.state.nameValue}
                                onChange={this.handleNameChange}
                            />
                            <button className="big-pushy" onClick={this.handleNameSubmit}>
                                Submit
                            </button>
                        </div>
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
                backgroundImage = "instructions";
                html = (
                    <div className="game-sized-container">
                        <h1>Deep within the Candy Cosmos...</h1>
                        <h2>The 2.009 Marshmallows need your help!</h2>
                        <p>
                            Move your mallow around the Graham Cracker Islands and clear any Monster Munchkins that may
                            be lurking. And who knows! You might just be a hero.
                        </p>
                        <p>What adventures await them next?</p>
                        <div className="button-container">
                            <button
                                onClick={() => {
                                    closeFx.play();
                                    this.setState({
                                        gameState: GameState.ATTRACT,
                                    });
                                }}
                                className="big-pushy play-btn"
                            >
                                Back!
                            </button>
                        </div>
                    </div>
                );
                break;
            case GameState.PLAYING:
                html = (
                    <div className="playing">
                        <GameApp fire={this.gameControlsFire} unfire={this.gameControlsUnfire} gameData={this.state.gameData} />
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
        const nameValue = event.target.value.replace(/[^A-Za-z0-9]/g, "").substring(0);
        this.setState({
            nameValue,
        });
    }

    private handleEnterGame = () => {
        // post to server, store token in state
        console.log("Starting Game. Exciting!");
        this.backgroundSoundRef.play();
        selectionFx.play();

        axios
            .post("/game/start")
            .then((res: any) => {
                this.setState({
                    guid: res.data.guid,
                    gameState: GameState.CHOOSE_CHARACTER,
                });
            })
            .catch((err: any) => console.log(err));
    };

    private handleStart = () => {
        // starts the game
        selectionFx.play();
        this.socket.emit("levelUp", this.state.guid);

        clearInterval(this.timer);
        this.timer = setInterval(() => {
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
        if (this.state.nameValue !== "") {
            axios
                .post("/game/playername", {
                    guid: this.state.guid,
                    playerName: this.state.nameValue,
                })
                .then((res: any) => {
                    this.setState({
                        leaderboard: res.data.leaderboard,
                        score: res.data.score,
                        gameState: GameState.ATTRACT,
                    });
                })
                .catch((err: any) => console.log(err));
        }
    };

    private handleCharacterSelect(color: TeamColor) {
        return () => {
            selectionFx.play();
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
