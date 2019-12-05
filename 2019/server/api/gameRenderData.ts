export enum TeamColor {
    PINK,
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    PURPLE,
    SILVER
}

export enum PlayMode {
    ONCE,
    LOOP,
    STOP
}

export interface IShape {
    x: number;
    y: number;
    heading?: number; // 0 - 7 like a clockwise starting North
    color?: TeamColor;
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
    WIN, // Win the level and move to next level
    MALLOW_HURT, // Mallow gets hit by a bullet but doesn't die
    MALLOW_DEATH, // Mallow dies
    MALLOW_MELT, // Mallow falls into melty lava of doom
    FINAL_WIN // You a champ
}

export interface IGameRenderData {
    currentLevel: number;
    score: number;
    teamColor: TeamColor;
    gameCommand?: GameCommand;
    livesLeft: number;
    playSound?: ISoundClip[];
    imagesToRender: {
        [player: string]: IRenderableImage;
    };
    bullets: IRenderableImage[];
    monsters: IRenderableImage[];
    tiles?: {
        pos: IShape;
        tileSize: number;
        level: number;
    };
}
