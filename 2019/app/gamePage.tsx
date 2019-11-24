import * as React from "react";
import * as ReactDOM from "react-dom";
import { ITeamColor } from "../server/api/gameRenderData";
import { GameApp } from "./components/game";

enum GameState {
    ATTRACT,
    CHOOSE_CHARACTER,
    PLAYING,
    INSTRUCTIONS,
    ERROR,
}

export interface IGamePageState {
    gameState: GameState;
}

export class GamePage extends React.PureComponent<{}, IGamePageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameState: GameState.ATTRACT,
        };
    }

    public render() {
        let html = <div>Loading...</div>;
        switch (this.state.gameState) {
            case GameState.ATTRACT:
                html = (
                    <div>
                        <h1>Intro Page!</h1>
                        <button onClick={this.handleStart} className="play-btn">
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
                        <div onClick={this.handleCharacterSelect(ITeamColor.BLUE)}>blue</div>
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
                        <GameApp />
                    </div>
                );
                break;
            default:
                html = <div>Error! Please refresh the page.</div>;
        }
        return html;
    }

    private handleStart = () => {
        // post to server, store token in state
        this.setState({
            gameState: GameState.CHOOSE_CHARACTER,
        });
    };

    private handleCharacterSelect(color: ITeamColor) {
        return () => {
            console.log("submitting team color ", color);
            this.setState({
                gameState: GameState.PLAYING,
            });
        };
    }
}

ReactDOM.render(<GamePage />, document.getElementById("game-content"));
