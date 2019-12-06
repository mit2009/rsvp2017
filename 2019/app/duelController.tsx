import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";
import { Command } from "../server/api/levelDuelData";

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

    public render() {
        return (
            <div>
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
                {this.renderButton(
                    "go to staging",
                    `{"user":-1, "command":1, "params": {"player0Color": 0, "player1Color": 1, "levelNumber":1}}`,
                )}
                {this.renderButton("go to countdown", `{"user":-1, "command":2, "params":{"countDownValue":3}}`)}
                <button onClick={this.handleGameStart}>START GAME TIMER</button>
            </div>
        );
    }

    private handleGameStart = () => {
        clearInterval(this.timer);
        socket.emit("duelUpdate", {
            user: -1,
            command: Command.GO_TO_PLAYING
        });
        this.timer = global.setInterval(() => {
            socket.emit("duelUpdate", {
                user: -1,
                command: Command.GET_FRAME
            });
        }, 100);
    };

    private renderButton(title: string, message: string) {
        return (
            <button
                onClick={() => {
                    this.loadQuickCommand(message);
                }}
            >
                {title}
            </button>
        );
    }

    private loadQuickCommand(message: string) {
        this.setState({
            textValue: message,
        });
    }

    private keyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        console.log("Key pressed:", event.key);

        if (event.key === "Enter") {
            if (this.state.textValue !== "") {
                socket.emit(this.state.eventValue, JSON.parse(this.state.textValue);
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
