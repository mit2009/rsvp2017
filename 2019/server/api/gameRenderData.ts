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