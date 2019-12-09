import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { emit } from "cluster";
import { socketIp } from "../config";
import { Command, IDuelSocketCommand, IDuelStateSocketData, PageState } from "../server/api/levelDuelData";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

interface IDuelControllerState {
    textValue: string;
    eventValue: string;
    historyPointer: number;
    history: Array<{
        eventName: string;
        message: string;
    }>;
}

export class DuelController extends React.PureComponent<{}, IDuelControllerState> {
    private timer: NodeJS.Timer;
    private messageInput: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.state = {
            textValue: "",
            eventValue: "duelUpdate",
            history: [],
            historyPointer: 0,
        };
    }

    public componentDidMount() {
        socket.on("duelResponse", (data: IDuelStateSocketData) => {
            if (data !== null) {
                if (data.pageState !== PageState.PLAYING) {
                    clearInterval(this.timer);
                }

                if (data !== null && data.gameData == null) {
                    this.setState(previousState => {
                        const history = [
                            {
                                eventName: "response",
                                message: JSON.stringify(data),
                            },
                        ].concat(previousState.history);
                        return {
                            history,
                            historyPointer: 0,
                        };
                    });
                }
            }
        });
    }

    public render() {
        return (
            <div className="dashboard">
                <div className="manual-input">
                    <input
                        className="event-textbox"
                        type="text"
                        value={this.state.eventValue}
                        onChange={this.handleEventChange}
                    />

                    <input
                        type="text"
                        value={this.state.textValue}
                        onChange={this.handleChange}
                        onKeyDown={this.keyPress}
                        ref={input => {
                            this.messageInput = input;
                        }}
                    />
                    <div className="history">
                        {this.state.history.map((value, key) => {
                            return (
                                <div className="history-line" key={key}>
                                    <span className="dem">{value.eventName}</span>
                                    {value.message}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="shortcuts">{this.renderButtons()}</div>
            </div>
        );
    }

    private renderButtons() {
        return (
            <div>
                {this.renderButton("go ATTRACT", `{"user":-1, "command":0}`)}
                {this.renderButton(
                    "go STAGING (blue/red)",
                    `{"user":-1, "command":1, "params": {"player0Color": 5, "player1Color": 1, "levelNumber":1}}`,
                )}
                {this.renderButton(
                    "go STAGING (purple/orange)",
                    `{"user":-1, "command":1, "params": {"player0Color": 6, "player1Color": 2, "levelNumber":2}}`,
                )}
                {this.renderButton(
                    "go STAGING (yellow/silver)",
                    `{"user":-1, "command":1, "params": {"player0Color": 3, "player1Color": 7, "levelNumber":3}}`,
                )}
                {this.renderButton(
                    "go STAGING (green/pink)",
                    `{"user":-1, "command":1, "params": {"player0Color": 4, "player1Color": 0, "levelNumber":4}}`,
                )}

                {/* this.renderButton("go COUNTDOWN", `{"user":-1, "command":2, "params":{"countDownValue":3}}`) */}
                <button onClick={this.handleGameStart}>START GAME TIMER</button>
                <button onClick={this.handleGameStop}>STOP GAME TIMER</button>
                <button
                    onClick={() => {
                        socket.emit("clientCommand", {});
                    }}
                >
                    REFRESH CLIENT
                </button>
            </div>
        );
    }

    private handleGameStart = () => {
        clearInterval(this.timer);
        socket.emit("duelUpdate", {
            user: -1,
            command: Command.GO_TO_PLAYING,
        });
        this.timer = global.setInterval(() => {
            console.log(Date.now());
            socket.emit("duelUpdate", {
                user: -1,
                command: Command.GET_FRAME,
            });
        }, 40);
    };

    private handleGameStop = () => {
        clearInterval(this.timer);
    };

    private renderButton(title: string, message: string) {
        return (
            <button
                onClick={() => {
                    this.directCommand(message);
                }}
            >
                <div className="title">{title}</div>
                <div className="message">{JSON.stringify(JSON.parse(message))}</div>
            </button>
        );
    }

    private loadQuickCommand(message: string) {
        this.setState({
            textValue: message,
        });
        this.messageInput.focus();
    }

    private directCommand(message: string) {
        const data = JSON.parse(message) as IDuelSocketCommand;
        socket.emit("duelUpdate", {
            user: -1,
            command: data.command,
            params: data.params,
        });
    }

    private keyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        console.log("Key pressed:", event.key);

        if (event.key === "Enter") {
            if (this.state.textValue !== "") {
                socket.emit(this.state.eventValue, JSON.parse(this.state.textValue));
                this.setState(previousState => {
                    const history = [
                        {
                            eventName: this.state.eventValue,
                            message: this.state.textValue,
                        },
                    ].concat(previousState.history);
                    return {
                        textValue: "",
                        history,
                        historyPointer: 0,
                    };
                });
            }
        } else if (event.key === "ArrowDown") {
            this.setState({
                textValue: this.state.history[this.state.historyPointer].message,
                historyPointer: Math.min(this.state.historyPointer + 1, this.state.history.length - 1),
            });
        } else if (event.key === "ArrowUp") {
            this.setState({
                textValue: this.state.history[this.state.historyPointer].message,
                historyPointer: Math.max(this.state.historyPointer - 1, 0),
            });
        }
    }

    private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            textValue: event.target.value,
        });
    }

    private handleEventChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            eventValue: event.target.value,
        });
    }
}

ReactDOM.render(<DuelController />, document.getElementById("duel-controller-content"));
