import { Bullet } from "./bullet";
import { radians_to_degrees } from "./angles";
import { IRenderableImage, IShape } from "../api/gameRenderData";
import { playerWidth, playerHeight, widthOffset, heightOffset, tileWidth, tileHeight} from "../api/levelData";

export class Player {
    xcor: number;
    ycor: number;
    heading: number;

    velocity: number = 50;
    turningAngle: number;

    constructor(xcor: number, ycor: number, heading: number) {
        this.xcor = (xcor + 0.5) * tileWidth;
        this.ycor = (ycor + 0.5) * tileHeight;
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
            this.xcor += this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor -= this.velocity * Math.cos(this.heading)  * timeDelta;
        }
        if (down) {
            this.xcor -= this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor += this.velocity * Math.cos(this.heading)  * timeDelta;
        }
    }

    getBlobHeading() {
        let degreesHeading = radians_to_degrees(this.heading);
        degreesHeading = degreesHeading % 360;
        degreesHeading = (degreesHeading + 360 + 22.5) % 360;
        return Math.floor(degreesHeading / 45);
    }

    getBlob() {
        return {
            pos: {
                x: this.xcor - playerWidth / 2 + widthOffset,
                y: this.ycor - playerHeight / 2 + heightOffset,
                heading: this.getBlobHeading(),
                w: playerWidth,
                h: playerHeight
            } as IShape,
            resourceId: 'player1'
        } as IRenderableImage;
    }
}
