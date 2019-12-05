import * as React from "react";
import * as ReactDOM from "react-dom";
import * as socketio from "socket.io-client";

import { socketIp } from "../config";

const SOCKET_URL = socketIp;
const socket: SocketIOClient.Socket = socketio(SOCKET_URL);

enum PageState {
    ATTRACT
}

export interface IDuelPageState {
    pageState: PageState.ATTRACT;
}

export class DuelPage extends React.PureComponent<{}, IDuelPageState> {
    constructor(props: any) {
        console.log("Initializing Duel Page");
        super(props);

        socket.on("levelUpdate", (data: any) => {
            console.log(data);
        });

        this.state = {
            pageState: PageState.ATTRACT
        };
    }

    public render() {
        switch (this.state.pageState) {
            case PageState.ATTRACT:
                console.log("In Attract");
                break;
        }
        return <div>hi</div>;
    }
}

console.log("react");

ReactDOM.render(<DuelPage />, document.getElementById("duel-content"));
