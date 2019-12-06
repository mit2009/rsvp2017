import * as React from "react";

// @ts-ignore
import UIfx from "uifx";

import { IGameRenderData, TeamColor } from "../../server/api/gameRenderData";
import {
    getLevel,
    heightOffset,
    tileHeight,
    tileWidth,
    widthOffset
} from "../../server/api/levelData";

import {
    getLevel as getDuelLevel,
    heightOffset as duelHeightOffset,
    tileHeight as tileDuelHeight,
    tileWidth as tileDuelWidth,
    widthOffset as duelWidthOffset,
} from "../../server/api/levelDuelData";

const BASE_RESOURCE_URL = "/images/gameAssets/";

let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;

export interface IImageAsset {
    resourceUrl: string;
    loaded: boolean;
    hasHeading?: boolean;
    hasColorVariants?: boolean;
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
    isDuel?: boolean;
    gameData: IGameRenderData;
    fire?: () => void;
    unfire?: () => void;
}
export interface IGameAppState {
    mallowColor: string;
}

export class GameApp extends React.PureComponent<IGameAppProps, IGameAppState> {
    private canvas: HTMLCanvasElement;

    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    private imageStore: { [imageId: string]: HTMLImageElement } = {};
    private soundStore: any = {};

    private assets: IAssets = {
        images: {
            player1: {
                resourceUrl: "player-%-#.png",
                loaded: false,
                hasHeading: true,
                hasColorVariants: true,
            },
            player2: {
                resourceUrl: "player-%-#.png",
                loaded: false,
                hasHeading: true,
                hasColorVariants: true,
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
                heightOffset: -10,
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
                resourceUrl: "monster1-4.png",
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
            bulletShoot: {
                resourceUrl: "player-shoot-sound.wav",
                loaded: false,
            },
            enemyHurt: {
                resourceUrl: "success-hit-sound.wav",
                loaded: false,
            },
            playerHurt: {
                resourceUrl: "player-hit-sound.wav",
                loaded: false,
            },
            playerDie: {
                resourceUrl: "game-over-sound.wav",
                loaded: false,
            },
            levelUp: {
                resourceUrl: "new-level-sound.wav",
                loaded: false,
            },
            levelStart: {
                resourceUrl: "win-game-sound.wav",
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
        if (this.props.isDuel) {
            CANVAS_WIDTH = 1920;
            CANVAS_HEIGHT = 840;
        }

        if (this.canvas !== null) {
            this.ctx = this.canvas.getContext("2d");
            this.drawGameAssets(this.ctx);
        }
    }

    public render() {
        if (this.props && this.props.gameData) {
            if (this.props.isDuel) {
                return <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
            } else {
                return (
                    <div className="three-panel">
                        <div className="sidebar sidebar-left">
                            <div className="level">
                                <div className="mobile-level">
                                    <h3>{this.props.gameData.currentLevel}</h3>
                                    <h2>Level</h2>
                                </div>
                                <div className="mobile-score">
                                    <h3 className="score">{this.props.gameData.score}</h3>
                                    <h2>Score</h2>
                                </div>
                            </div>
                            <div className="lives">{this.props.gameData.livesLeft} &times;</div>
                        </div>
                        <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                        <div className="sidebar sidebar-right">
                            <div className="mobile-control"></div>
                            <div
                                onPointerDown={this.props.fire}
                                onPointerUp={this.props.unfire}
                                className="big-pushy mobile-control-shoot"
                            >
                                fire
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            return <div>loading...</div>;
        }
    }

    // Loads the images

    private imageLoader() {
        for (const imageId of Object.keys(this.assets.images)) {
            const image = this.assets.images[imageId];

            let duelConditional = "";

            if (this.props.isDuel) {
                duelConditional = "duel/";
            }

            let imageName = imageId;
            let imageSrc = BASE_RESOURCE_URL + duelConditional + image.resourceUrl;
            let imagesToGenerate = [[imageName, imageSrc]];

            if (image.hasHeading) {
                imagesToGenerate = [];
                for (let h = 0; h < 8; h++) {
                    imageName = imageId + "-" + h;
                    imageSrc = BASE_RESOURCE_URL + duelConditional + image.resourceUrl.replace("#", h + "");

                    if (image.hasColorVariants) {
                        for (let colorIndex = 0; colorIndex < 8; colorIndex++) {
                            const imageNameWithColor = imageName + "-" + TeamColor[colorIndex].toLowerCase();
                            const imageSrcWithColor = imageSrc.replace("%", TeamColor[colorIndex].toLowerCase());
                            imagesToGenerate.push([imageNameWithColor, imageSrcWithColor]);
                        }
                    } else {
                        imagesToGenerate.push([imageName, imageSrc]);
                    }
                }
            }

            for (const [n, s] of imagesToGenerate) {
                this.imageStore[n] = new Image();
                this.imageStore[n].src = s;
                this.imageStore[n].onload = () => {
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
            this.soundStore[soundId] = new UIfx(BASE_RESOURCE_URL + sound.resourceUrl, {
                volume: 1,
            });

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

        // random sound loader goes here for some reason

        if (this.props.gameData.playSound.length > 0) {
            for (const sound of this.props.gameData.playSound) {
                this.soundStore[sound.resourceId].play();
            }
        }

        if (context && this.props.gameData !== null && this.props.gameData !== undefined) {
            // TODO: abstract
            context.clearRect(0, 0, this.props.isDuel ? 1960 : 600, this.props.isDuel ? 840 : 600);

            // Render anything with a specified ZIndex

            // this.renderZIndexItems(context, data);
            this.checkForDepthRender(context, data, 0, this.props.isDuel ? tileDuelWidth : tileWidth);

            // Render the Tiles

            let lastY = 0;

            let tileMap;

            if (this.props.isDuel) {
                tileMap = getDuelLevel(data.currentLevel);
            } else {
                tileMap = getLevel(data.currentLevel);
            }

            for (let yIndex = 0; yIndex < tileMap.length; yIndex++) {
                const row = tileMap[yIndex];

                for (let xIndex = 0; xIndex < row.length; xIndex++) {
                    const x =
                        (this.props.isDuel ? duelWidthOffset : widthOffset) +
                        xIndex * (this.props.isDuel ? tileDuelWidth : tileWidth);
                    const y =
                        (this.props.isDuel ? duelHeightOffset : heightOffset) +
                        yIndex * (this.props.isDuel ? tileDuelHeight : tileHeight);
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
                        let th = !this.props.isDuel ? tileHeight : tileDuelHeight;
                        if (tileId === "tile4") {
                            th *= 1.33333333333;
                        }
                        context.drawImage(
                            imageData,
                            x,
                            y + graphicHeightOffset,
                            !this.props.isDuel ? tileWidth : tileDuelWidth,
                            th,
                        );
                    }
                }

                this.checkForDepthRender(
                    context,
                    data,
                    lastY,
                    lastY + (!this.props.isDuel ? tileHeight : tileDuelHeight),
                );
            }

            this.checkForDepthRender(context, data, lastY, CANVAS_HEIGHT);
        }
    }

    // Checks the list of items to render with a zIndex. These will by
    // default be rendered before the other elements
    /*

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

        */

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
                    let imageStoreIndex =
                        data.imagesToRender[itemToRenderId].resourceId + "-" + itemToRender.pos.heading;

                    if (this.assets.images[itemToRenderId].hasColorVariants) {
                        imageStoreIndex = imageStoreIndex + "-" + TeamColor[itemToRender.pos.color].toLowerCase();
                    }
                    context.drawImage(
                        this.imageStore[imageStoreIndex],
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
                context.drawImage(
                    this.imageStore[bullet.resourceId],
                    bullet.pos.x,
                    bullet.pos.y,
                    bullet.pos.w,
                    bullet.pos.h,
                );
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
