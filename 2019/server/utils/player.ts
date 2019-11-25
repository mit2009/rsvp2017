import { Bullet } from "./bullet";

import { IRenderableImage, IShape } from "../api/gameRenderData";
import { playerWidth, playerHeight, widthOffset, heightOffset } from "../api/levelData";

export class Player {
    xcor: number;
    ycor: number;
    heading: number;

    velocity: number = 50;
    turningAngle: number;

    constructor(xcor: number, ycor: number, heading: number) {
        this.xcor = xcor;
        this.ycor = ycor;
        this.heading = heading;
    }

    fireBullet() {
        return new Bullet(this.xcor, this.ycor, this.heading, true);
    }

    update(timeDelta: number, left: boolean, right: boolean, forward: boolean) {
        if (left) {
          this.heading -= 1 * timeDelta;
        }
        if (right) {
          this.heading += 1 * timeDelta;
        }
        if (forward) {
            console.log("here");
            this.xcor += this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor -= this.velocity * Math.cos(this.heading)  * timeDelta;
        }
    }

    getBlob() {
        return {
            pos: {
                x: this.xcor - playerWidth / 2 + widthOffset,
                y: this.ycor - playerHeight / 2 + heightOffset,
                w: playerWidth,
                h: playerHeight
            } as IShape,
            resourceId: 'player1'
        } as IRenderableImage;
    }
}
