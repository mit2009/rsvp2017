import { getBlobHeading } from "./angles";
import { Bullet } from "./bullet";
import { IRenderableImage, IShape } from "../api/gameRenderData";
import { monsterWidth, monsterHeight, widthOffset, heightOffset, tileWidth, tileHeight } from "../api/levelData";

interface Action {
    delay: number,
    deltaHeading: number,
    fire: boolean,
}

const AIs: {[key: number]: Action[]} = {
    6:  [{delay: 1, deltaHeading: 0, fire: false}],
    7:  [{delay: 500, deltaHeading: 0, fire: true}],
    8:  [{delay: 500, deltaHeading: 0, fire: true}],
    9:  [{delay: 500, deltaHeading: 0, fire: true}],
    10: [{delay: 500, deltaHeading: 0, fire: true}],
    11: [{delay: 500, deltaHeading: Math.PI / 4, fire: true}],
}

export class Monster {

    public xcor: number;
    public ycor: number;
    heading: number;
    ai: number;


    lastAction: number;
    lastActionTime: number;

    constructor(xcor: number, ycor: number, heading: number, ai: number) {
        this.xcor = (xcor + 0.5) * tileWidth;
        this.ycor = (ycor + 0.5) * tileHeight;
        this.heading = heading;
        this.ai = ai;

        this.lastAction = 0;
        this.lastActionTime = Date.now();
    }

    update() {
        const ai = AIs[this.ai];
        const lastAct = ai[this.lastAction]
        if (Date.now() - this.lastActionTime > lastAct.delay) {
            this.heading += lastAct.deltaHeading;
            this.lastAction = (this.lastAction + 1) % ai.length;
            this.lastActionTime = Date.now();
            if (lastAct.fire) {
                return this.fireBullet();
            }
        }
        return false;
    }

    fireBullet() {
        const bulletOffset = 0;
        return new Bullet(this.xcor + bulletOffset  * Math.sin(this.heading), this.ycor  - bulletOffset  * Math.cos(this.heading), this.heading, false, 0);
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
