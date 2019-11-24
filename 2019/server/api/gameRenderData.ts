
export enum ITeamColor {
    PINK,
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    PURPLE,
    SILVER,
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

export interface IGameRenderData {
    currentLevel: number;
    teamColor: ITeamColor;
    livesLeft: number;
    imagesToRender: {
        [player1: string]: IRenderableImage;
    };
    bullets: IRenderableImage[];
    monsters: IRenderableImage[];
    tiles: {
        pos: IShape;
        tileSize: number;
        level: number;
    };
};