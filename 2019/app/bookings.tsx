import * as React from "react";
import * as ReactDOM from "react-dom";

export class BookingsApp extends React.PureComponent<{}, {}> {
    public render() {
        return <div>Hello! App, go!</div>;
    }
}
ReactDOM.render(<BookingsApp />, document.getElementById("content"));
