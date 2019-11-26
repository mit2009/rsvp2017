import { IRenderableImage, IShape } from "../api/gameRenderData";
import { bulletWidth, bulletHeight, widthOffset, heightOffset, tileWidth, tileHeight, walls } from "../api/levelData";

export class Bullet {
    xcor: number;
    ycor: number;

    deltaX: number;
    deltaY: number;

    playerFired: boolean;

    bounces: number;

    maxBounces: number = 2;
    velocity: number = 20;

    constructor(xcor: number, ycor: number, heading: number, playerFired: boolean) {
        this.xcor = xcor;
        this.ycor = ycor;

        this.deltaX = this.velocity * Math.sin(heading);
        this.deltaY = -this.velocity * Math.cos(heading);

        this.playerFired = playerFired;

        this.bounces = 0;
    }

    update(timeDelta: number, levelMap: number[][]) {
        console.log(this.deltaX * timeDelta);
        this.xcor += this.deltaX * timeDelta;
        const xmapY = Math.floor(this.ycor / tileHeight);
        const xmapX = Math.floor((this.xcor + bulletWidth / 2) / tileHeight);
        if (~walls.indexOf(levelMap[xmapY][xmapX])) {
            this.deltaX = -this.deltaX;
            this.xcor = Math.floor(this.xcor * 4) / 4;
            this.bounces += 1;
        }
        this.ycor += this.deltaY * timeDelta;

        const ymapY = Math.floor((this.ycor + bulletHeight / 2) / tileHeight);
        const ymapX = Math.floor(this.xcor / tileHeight);
        if (~walls.indexOf(levelMap[ymapY][ymapX])) {
            this.deltaY = -this.deltaY;
            this.ycor = Math.floor(this.ycor * 4) / 4;
            this.bounces += 1;
        }
        if (this.bounces > this.maxBounces) {
            return false;
        }

        return true;
    }

    getBlob() {
        return {
            pos: {
                x: this.xcor - bulletWidth / 2 + widthOffset,
                y: this.ycor - bulletHeight / 2 + heightOffset,
                w: bulletWidth,
                h: bulletHeight
            } as IShape,
            resourceId: 'bullet'
        } as IRenderableImage;
    }
}
