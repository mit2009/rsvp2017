import * as React from "react";

// import UIfx from "uifx";

import { IGameRenderData, PlayMode, TeamColor } from "../../server/api/gameRenderData";
import { getLevel, heightOffset, tileWidth, tileHeight, widthOffset } from "../../server/api/levelData";

const BASE_RESOURCE_URL = "/images/gameAssets/";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

export interface IImageAsset {
    resourceUrl: string;
    loaded: boolean;
    hasHeading?: boolean;
    heightOffset?: number;
    zIndex?: number;
}

export interface ISoundAsset {
    resourceUrl: string;
    loaded: boolean;
}

export interface IAssets {
    images: { [imageId: string]: IImageAsset };
    sounds?: { [soundId: string]: ISoundAsset };
}

export interface IGameAppProps {
    gameData: IGameRenderData;
}
export interface IGameAppState {
    mallowColor: string;

}

export class GameApp extends React.PureComponent<IGameAppProps, IGameAppState> {
    private canvas: HTMLCanvasElement;

    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    private imageStore: { [imageId: string]: HTMLImageElement } = {};


    // private gameRenderData: IGameRenderData = {
    //     // SAMPLE DATA FORMAT HERE:

    //     currentLevel: 1,
    //     score: 100,
    //     teamColor: TeamColor.BLUE,
    //     livesLeft: 3,

    //     playSound: [
    //         {
    //             playMode: PlayMode.ONCE,
    //             resourceId: "pew",
    //         },
    //     ],

    //     imagesToRender: {
    //         player1: {
    //             pos: { x: 60, y: 449, w: 30, h: 30 },
    //             resourceId: "player1",
    //         },
    //         background: {
    //             pos: { x: 0, y: 0 },
    //             resourceId: "background",
    //         },
    //     },

    //     monsters: [
    //         {
    //             pos: { x: 60, y: 420, w: 24, h: 35 },
    //             resourceId: "monster1",
    //         },
    //     ],

    //     bullets: [
    //         {
    //             pos: { x: 60, y: 60, w: 15, h: 22 },
    //             resourceId: "bullet",
    //         },
    //         {
    //             pos: { x: 100, y: 60, w: 15, h: 22 },
    //             resourceId: "bullet",
    //         },
    //         {
    //             pos: { x: 260, y: 60, w: 15, h: 22 },
    //             resourceId: "bullet",
    //         },
    //     ],

    //     tiles: {
    //         pos: { x: 60, y: 60 },
    //         tileSize: 30,
    //         level: 1,
    //     },
    // };

    private assets: IAssets = {
        images: {
            player1: {
                resourceUrl: "player-blue-#.png",
                loaded: false,
                hasHeading: true,
            },
            tile1: {
                resourceUrl: "tile0.png",
                loaded: false,
            },
            tile2: {
                resourceUrl: "tile1.png",
                loaded: false,
            },
            tile3: {
                resourceUrl: "tile2.png",
                loaded: false,
                heightOffset: -10,
            },
            tile4: {
                resourceUrl: "tile3.png",
                loaded: false,
                heightOffset: -20,
            },
            tile5: {
                resourceUrl: "tile1.png",
                loaded: false,
            },
            tile6: {
                resourceUrl: "tile1.png",
                loaded: false,
            },
            monster1: {
                resourceUrl: "monster1.png",
                loaded: false,
            },
            bullet: {
                resourceUrl: "bullet.png",
                loaded: false,
            },

            background: {
                resourceUrl: "background.png",
                loaded: false,
                zIndex: 0,
            },

        },
        sounds: {
            pew: {
                resourceUrl: "pew.mp4",
                loaded: false,
            },
        },
    };

    constructor(props: any) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            mallowColor: "green",
        };

        // Load assets
        this.imageLoader();
        this.soundLoader();
    }

    public componentDidUpdate() {
        this.canvas = this.canvasRef.current;

        if (this.canvas !== null) {
            this.ctx = this.canvas.getContext("2d");
            this.drawGameAssets(this.ctx);
        }
        // setTimeout(() => {
        //     //
        // }, 10);
    }

    public render() {
        if (this.props && this.props.gameData) {
            return (
                <div className="three-panel">
                    <div className="sidebar sidebar-left">
                        <div className="level">
                            <h3>{this.props.gameData.currentLevel}</h3>
                            <h2>Level</h2>
                            <h3 className="score">{this.props.gameData.score}</h3>
                            <h2>Score</h2>
                        </div>
                        Lives Left: {this.props.gameData.livesLeft}
                    </div>
                    <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                    <div className="sidebar sidebar-right" />
                </div>
            );
        } else {
            return (<div>loading...</div>);
        }
    }

    // Loads the images

    private imageLoader() {
        for (let imageId of Object.keys(this.assets.images)) {
            const image = this.assets.images[imageId];

            if (image.hasHeading) {
                for (let h = 0; h < 8; h++) {
                    console.log("loaded item heading with ", imageId + h);
                    this.imageStore[imageId + h] = new Image();
                    this.imageStore[imageId + h].src = BASE_RESOURCE_URL + image.resourceUrl.replace("#", h + "");
                    this.imageStore[imageId + h].onload = (e) => {

                        // // @ts-ignore
                        // const pathName = e.target.src;
                        // const fileName = pathName.split("/")[pathName.split("/").length - 1].split(".")[0];
                        // console.log(fileName);

                        // // TODO: build better loading mechanism
                        // this.assets.images[fileName].loaded = true;

                        // console.log(this.assets.images);
                        this.forceUpdate();
                    };
                }
            } else {
                this.imageStore[imageId] = new Image();
                this.imageStore[imageId].src = BASE_RESOURCE_URL + image.resourceUrl;
                this.imageStore[imageId].onload = (e) => {

                    // // @ts-ignore
                    // const pathName = e.target.src;
                    // const fileName = pathName.split("/")[pathName.split("/").length - 1].split(".")[0];

                    // // TODO: build better loading mechanism

                    // this.assets.images[fileName].loaded = true;
                    this.forceUpdate();
                };
            }
        }
    }

    // Loads the sounds

    private soundLoader() {
        for (const soundId of Object.keys(this.assets.sounds)) {
            const sound = this.assets.sounds[soundId];

            // TODO Implement sound player;
            console.log(sound);

            /*
            this.imageStore[imageId] = new Image();
            this.imageStore[imageId].src = BASE_RESOURCE_URL + image.resourceUrl;
            this.imageStore[imageId].onload = () => {
                // TODO: build better loading mechanism

                this.assets.images[imageId].loaded = true;
            };
            */
        }
    }

    // Draws the game assets

    private drawGameAssets(context: CanvasRenderingContext2D) {
        // const data = this.props;
        const data = this.props.gameData;

        if (context && this.props.gameData) {

            // TODO: abstract
            context.clearRect(0, 0, 600, 600);

            // Render anything with a specified ZIndex
            this.renderZIndexItems(context, data);
            this.checkForDepthRender(context, data, 0, heightOffset);

            // Render the Tiles

            let lastY = 0;
            const tileMap = getLevel(data.currentLevel);

            for (let yIndex = 0; yIndex < tileMap.length; yIndex++) {
                const row = tileMap[yIndex];

                for (let xIndex = 0; xIndex < row.length; xIndex++) {

                    const x = widthOffset + xIndex * tileWidth;
                    const y = heightOffset + yIndex * tileHeight;
                    lastY = y;

                    let tileValue = tileMap[yIndex][xIndex];
                    if (tileValue > 4) {
                        tileValue = 2;
                    }

                    const tileId = "tile" + tileValue;
                    const imageData = this.imageStore[tileId];
                    const graphicHeightOffset = this.assets.images[tileId].heightOffset
                        ? this.assets.images[tileId].heightOffset
                        : 0;

                    if (tileId !== "tile1") {
                        context.drawImage(imageData, x, y + graphicHeightOffset);
                    }
                }

                this.checkForDepthRender(context, data, lastY, lastY + tileHeight);
            }

            this.checkForDepthRender(context, data, lastY, CANVAS_HEIGHT);
        }
    }

    // Checks the list of items to render with a zIndex. These will by
    // default be rendered before the other elements

    private renderZIndexItems(context: CanvasRenderingContext2D, data: IGameRenderData) {
        const sortable = [];
        for (const imageId of Object.keys(data.imagesToRender)) {
            const item = data.imagesToRender[imageId];
            const asset = this.assets.images[imageId];
            if (asset.zIndex !== undefined) {
                sortable.push([asset.zIndex, asset, item, imageId]);
            }
        }
        sortable.sort((a: any, b: any) => {
            return a[0] - b[0];
        });
        for (const imageProps of sortable) {
            const [, , item, imageId] = imageProps;
            // It'll be ok, but if you know of a better way to do this
            // Please let me know.
            // @ts-ignore


            // TEMPORARILY COMMENTED OUT
            // context.drawImage(this.imageStore[imageId], item.pos.x, item.pos.y);
        }
    }

    // Ineffiencetly checks the list of items to render. If it falls
    // within the range of the tile depth map, goes ahead and renders it

    private checkForDepthRender(
        context: CanvasRenderingContext2D,
        data: IGameRenderData,
        minDepth: number,
        maxDepth: number,
    ) {
        // render all images to render

        for (const itemToRenderId of Object.keys(data.imagesToRender)) {
            const itemToRender = data.imagesToRender[itemToRenderId];

            const itemY = itemToRender.pos.y + itemToRender.pos.h;

            if (itemY > minDepth && itemY <= maxDepth) {
                if (this.assets.images[itemToRenderId].hasHeading) {

                    context.drawImage(
                        this.imageStore[data.imagesToRender[itemToRenderId].resourceId + itemToRender.pos.heading],
                        data.imagesToRender[itemToRenderId].pos.x,
                        data.imagesToRender[itemToRenderId].pos.y,
                        data.imagesToRender[itemToRenderId].pos.w,
                        data.imagesToRender[itemToRenderId].pos.h,
                    );

                } else {
                    context.drawImage(
                        this.imageStore[data.imagesToRender[itemToRenderId].resourceId],
                        data.imagesToRender[itemToRenderId].pos.x,
                        data.imagesToRender[itemToRenderId].pos.y,
                        data.imagesToRender[itemToRenderId].pos.w,
                        data.imagesToRender[itemToRenderId].pos.h,
                    );
                }
            }
        }

        // render bullets

        for (const bullet of this.props.gameData.bullets) {
            const itemY = bullet.pos.y + bullet.pos.h;
            if (itemY > minDepth && itemY <= maxDepth) {
                context.drawImage(this.imageStore[bullet.resourceId], bullet.pos.x, bullet.pos.y, bullet.pos.w, bullet.pos.h);
            }
        }

        // render monster

        for (const monster of this.props.gameData.monsters) {
            const itemY = monster.pos.y + monster.pos.h;
            if (itemY > minDepth && itemY <= maxDepth) {
                context.drawImage(this.imageStore[monster.resourceId], monster.pos.x, monster.pos.y);
            }
        }
    }
}
