import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

interface IDuelControllerState {
    textValue: string;
    eventValue: string;
    history: {
        eventName: string;
        message: string;
    }[];
}

export class DuelController extends React.PureComponent<
    {},
    IDuelControllerState
> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.state = {
            textValue: "",
            eventValue: "command",
            history: []
        };
    }

    public render() {
        return (
            <div>
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
                    onKeyPress={this.keyPress}
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
        );
    }

    private keyPress(event) {
        if (event.key === "Enter") {
            if (this.state.textValue !== "") {
                const data = {
                    event: "command",
                    message: this.state.textValue
                };
                socket.emit("command", data);
                this.setState(previousState => {
                    const history = [
                        {
                            eventName: this.state.eventValue,
                            message: this.state.textValue
                        }
                    ].concat(previousState.history);
                    return {
                        textValue: "",
                        history
                    };
                });
            }
        }
    }

    private handleChange(event) {
        this.setState({
            textValue: event.target.value
        });
    }

    private handleEventChange(event) {
        this.setState({
            eventValue: event.target.value
        });
    }
}

ReactDOM.render(
    <DuelController />,
    document.getElementById("duel-controller-content")
);
