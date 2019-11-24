import { Bullet } from "./bullet";

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
            xcor: this.xcor,
            ycor: this.ycor,
            heading: this.heading
        }
    }
}
