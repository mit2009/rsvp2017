export enum TeamColor {
    PINK,
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    PURPLE,
    SILVER,
}

export enum PlayMode {
    ONCE,
    LOOP,
    STOP,
}

export interface IShape {
    x: number;
    y: number;
    w?: number;
    h?: number;
}

export interface IRenderableImage {
    pos: IShape;
    resourceId: string;
}

export interface ISoundClip {
    playMode: PlayMode;
    resourceId: string;
}


export enum GameCommand {
    WIN,            // Win the level and move to next level
    MALLOW_HURT,    // Mallow gets hit by a bullet but doesn't die
    MALLOW_DEATH,   // Mallow dies
    MALLOW_MELT,    // Mallow falls into melty lava of doom
}

export interface IGameRenderData {
    currentLevel: number;
    score: 100;
    teamColor: TeamColor;
    gameCommand?: GameCommand;
    livesLeft: number;
    playSound?: ISoundClip[];
    imagesToRender: {
        [player1: string]: IRenderableImage;
    };
    bullets: IRenderableImage[];
    monsters: IRenderableImage[];
    tiles?: {
        pos: IShape;
        tileSize: number;
        level: number;
    };
}
