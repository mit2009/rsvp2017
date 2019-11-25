import { Bullet } from "./bullet";
import { radians_to_degrees } from "./angles";
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

    update(timeDelta: number, up: boolean, down: boolean, left: boolean, right: boolean, levelMap: number[]) {
        console.log(down, levelMap);
        if (left) {
          this.heading -= 1 * timeDelta;
        }
        if (right) {
          this.heading += 1 * timeDelta;
        }
        if (up) {
            console.log("here");
            this.xcor += this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor -= this.velocity * Math.cos(this.heading)  * timeDelta;
        }
    }

    getBlobHeading() {
        let degreesHeading = radians_to_degrees(this.heading);
        degreesHeading += 45;
    }

    getBlob() {
        return {
            pos: {
                x: this.xcor - playerWidth / 2 + widthOffset,
                y: this.ycor - playerHeight / 2 + heightOffset,
                heading: 0,
                w: playerWidth,
                h: playerHeight
            } as IShape,
            resourceId: 'player1'
        } as IRenderableImage;
    }
}
