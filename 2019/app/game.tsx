import * as React from "react";
import * as ReactDOM from "react-dom";
import { IGameRenderData } from "../server/api/gameRenderData";

const BASE_RESOURCE_URL = "images/gameAssets/";

export interface IImageAsset {
    resourceUrl: string;
    loaded: boolean;
    heightOffset?: number;
}

export interface IAssets {
    images: { [imageId: string]: IImageAsset };
    sounds?: string[];
}

export interface IGameAppState {
    mallowColor: string;
}

export class GameApp extends React.PureComponent<{}, IGameAppState> {
    private canvas: HTMLCanvasElement;

    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    private imageStore: { [imageId: string]: HTMLImageElement } = {};

    private gameRenderData: IGameRenderData = {
        imagesToRender: {
            player1: {
                pos: { x: 60, y: 360, w: 30, h: 30 },
                resourceId: "player1",
            },
        },
        tiles: {
            pos: { x: 50, y: 10 },
            tileSize: 30,
            tileMap: [
                [2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [3, 3, 3, 3, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 2, 1, 2, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 1, 1, 1, 0, 1, 1, 3, 3, 2, 2, 2, 1, 1, 0, 1, 1, 1, 1],
                [2, 0, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 1, 1, 1, 0, 3, 1, 1, 1, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 0, 1, 1, 0, 3, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1],
                [3, 0, 0, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
                [3, 0, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            ],
        },
    };

    private assets: IAssets = {
        images: {
            player1: {
                resourceUrl: "roopop.png",
                loaded: false,
            },
            tile0: {
                resourceUrl: "tile0.png",
                loaded: false,
            },
            tile1: {
                resourceUrl: "tile1.png",
                loaded: false,
            },
            tile2: {
                resourceUrl: "tile2.png",
                loaded: false,
                heightOffset: -10,
            },
            tile3: {
                resourceUrl: "tile3.png",
                loaded: false,
                heightOffset: -20,
            },
        },
    };

    constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            mallowColor: "green",
        };

        // Load all the images

        this.imageLoader();
    }

    public componentDidMount() {
        setInterval(() => {
            this.gameRenderData.imagesToRender.player1.pos.x = 1 + this.gameRenderData.imagesToRender.player1.pos.x;
            this.forceUpdate();
        }, 50);
    }

    public componentDidUpdate() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");

        setTimeout(() => {
            this.drawGameAssets(this.ctx);
        }, 10);
    }

    public render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={700} height={700} />
            </div>
        );
    }

    private imageLoader() {
        for (const imageId of Object.keys(this.assets.images)) {
            const image = this.assets.images[imageId];
            console.log(this.imageStore[imageId]);

            this.imageStore[imageId] = new Image();
            this.imageStore[imageId].src = BASE_RESOURCE_URL + image.resourceUrl;
            this.imageStore[imageId].onload = () => {

                // TODO: build better loading mechanism

                this.assets.images[imageId].loaded = true;
            };
        }
    }

    private drawGameAssets(context: CanvasRenderingContext2D) {
        console.log(this.gameRenderData);
        const data = this.gameRenderData;

        if (context) {

            // Draw the Tiles

            for (let yIndex = 0; yIndex < data.tiles.tileMap.length; yIndex++) {
                const row = data.tiles.tileMap[yIndex];
                let lastY = 0;

                for (let xIndex = 0; xIndex < row.length; xIndex++) {
                    const x = data.tiles.pos.x + xIndex * data.tiles.tileSize;
                    const y = data.tiles.pos.y + yIndex * data.tiles.tileSize;
                    lastY = y;

                    const w = data.tiles.tileSize;
                    const h = data.tiles.tileSize;

                    const tileId = "tile" + data.tiles.tileMap[yIndex][xIndex];
                    const imageData = this.imageStore[tileId];
                    const heightOffset = this.assets.images[tileId].heightOffset
                        ? this.assets.images[tileId].heightOffset
                        : 0;
                    context.drawImage(imageData, x, y + heightOffset);
                }

                this.checkForDepthRender(context, data, lastY, lastY + data.tiles.tileSize);
            }
        }
    }

    private checkForDepthRender(
        context: CanvasRenderingContext2D,
        data: IGameRenderData,
        minDepth: number,
        maxDepth: number,
    ) {

        for (const itemToRenderId of Object.keys(this.gameRenderData.imagesToRender)) {
            const itemToRender = this.gameRenderData.imagesToRender[itemToRenderId];
            const itemY = itemToRender.pos.y + itemToRender.pos.h;

            if (itemY > minDepth && itemY <= maxDepth) {
                context.drawImage(
                    this.imageStore[data.imagesToRender.player1.resourceId],
                    data.imagesToRender.player1.pos.x,
                    data.imagesToRender.player1.pos.y,
                    data.imagesToRender.player1.pos.w,
                    data.imagesToRender.player1.pos.h,
                );
            }
        }
    }
}
ReactDOM.render(<GameApp />, document.getElementById("game-content"));
