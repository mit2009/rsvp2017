import { IRenderableImage, IShape } from "../api/gameRenderData";
import { monsterWidth, monsterHeight, widthOffset, heightOffset } from "../api/levelData";

export class Monster {

    xcor: number;
    ycor: number;
    ai: number;

    constructor(xcor: number, ycor: number, ai: number) {
        this.xcor = xcor;
        this.ycor = ycor;
        this.ai = ai;
    }

    getBlob() {
        return {
            pos: {
                x: this.xcor - monsterWidth / 2 + widthOffset,
                y: this.ycor - monsterHeight / 2 + heightOffset,
                w: monsterWidth,
                h: monsterHeight
            } as IShape,
            resourceId: 'monster1'
        } as IRenderableImage;
    }
}
