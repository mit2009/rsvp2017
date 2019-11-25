import { getBlobHeading } from "./angles";

import { IRenderableImage, IShape } from "../api/gameRenderData";
import { monsterWidth, monsterHeight, widthOffset, heightOffset, tileWidth, tileHeight } from "../api/levelData";

export class Monster {

    xcor: number;
    ycor: number;
    heading: number;
    ai: number;

    constructor(xcor: number, ycor: number, heading: number, ai: number) {
        this.xcor = (xcor + 0.5) * tileWidth;
        this.ycor = (ycor + 0.5) * tileHeight;
        this.heading = heading;
        this.ai = ai;
    }

    update(timeDelta: number) {
        return true;
    }

    getBlob() {
        return {
            pos: {
                x: this.xcor - monsterWidth / 2 + widthOffset,
                y: this.ycor - monsterHeight / 2 + heightOffset,
                heading: getBlobHeading(this.heading),
                w: monsterWidth,
                h: monsterHeight
            } as IShape,
            resourceId: 'monster1'
        } as IRenderableImage;
    }
}
