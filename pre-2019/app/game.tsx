import * as React from "react";
import * as ReactDOM from "react-dom";

export class GameApp extends React.PureComponent<{}, {}> {
    public render() {
        return <div>Hello! game, go!</div>;
    }
}

console.log("executed");

ReactDOM.render(<GameApp />, document.getElementById("game-content"));
