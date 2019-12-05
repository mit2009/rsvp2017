import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

interface IDuelControllerState {
    textValue: string;
    history: string[];
}

export class DuelController extends React.PureComponent<
    {},
    IDuelControllerState
> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.state = {
            textValue: "",
            history: []
        };
    }

    public render() {
        return (
            <div>
                <input
                    type="text"
                    value={this.state.textValue}
                    onChange={this.handleChange}
                    onKeyPress={this.keyPress}
                />
                <div>
                    {this.state.history.map((value, key) => {
                        return <div key={key}>{value}</div>;
                    })}
                </div>
            </div>
        );
    }

    private keyPress(event) {
        if (event.key === "Enter") {
            const data = {
                event: "command",
                message: this.state.textValue
            };
            socket.emit("command", data);
            this.setState(previousState => {
                const history = [previousState.textValue].concat(
                    previousState.history
                );
                return {
                    textValue: "",
                    history
                };
            });
        }
    }

    private handleChange(event) {
        this.setState({
            textValue: event.target.value
        });
    }
}

ReactDOM.render(
    <DuelController />,
    document.getElementById("duel-controller-content")
);
