import { Bullet } from "./bullet";
import { getBlobHeading } from "./angles";
import { IRenderableImage, IShape } from "../api/gameRenderData";
import { playerWidth, playerHeight, widthOffset, heightOffset, tileWidth, tileHeight, walls, voids } from "../api/levelData";

export class Player {
    startX: number;
    startY: number;

    xcor: number;
    ycor: number;
    heading: number;

    velocity: number = 3;
    turningAngle: number;

    constructor(xcor: number, ycor: number, heading: number) {
        this.xcor = (xcor + 0.5) * tileWidth;
        this.ycor = (ycor + 0.5) * tileHeight;
        this.startX = this.xcor;
        this.startY = this.ycor;

        this.heading = heading;
    }

    fireBullet() {
        return new Bullet(this.xcor, this.ycor, this.heading, true);
    }

    update(timeDelta: number, up: boolean, down: boolean, left: boolean, right: boolean, levelMap: number[][]) {
        const increment = 10;
        let counter = 0;

        while (counter + increment < timeDelta) {
            if (!this.updateHelper(increment, up, down, left, right, levelMap)) {
                return false
            }
            counter += increment;
        }

        return this.updateHelper(timeDelta - counter, up, down, left, right, levelMap);
    }

    updateHelper(timeDelta: number, up: boolean, down: boolean, left: boolean, right: boolean, levelMap: number[][]) {

        if (left) {
            this.heading -= 1 * timeDelta;
        }
        if (right) {
            this.heading += 1 * timeDelta;
        }

        const xVel = this.velocity * Math.sin(this.heading) * timeDelta;
        const yVel = -this.velocity * Math.cos(this.heading) * timeDelta;
        console.log("is dillon being dumb", xVel, yVel);
        if (up) {
            this.xcor += xVel;
            this.ycor += yVel;
        }
        if (down) {
            this.xcor -= xVel;
            this.ycor -= yVel;
        }

        const mapY = this.ycor / tileHeight;
        const mapX = this.xcor / tileWidth;
        for (let i of [-0.5, 0, 0.5]) {
            if (~walls.indexOf(levelMap[Math.floor(mapX + i)][Math.floor(mapY)])) {
                this.xcor = (Math.floor(mapX) + 0.5) * tileWidth;
            }

            if (~walls.indexOf(levelMap[Math.floor(mapX)][Math.floor(mapY + i)])) {
                this.ycor = (Math.floor(mapY) + 0.5) * tileHeight;
            }
        }

        // const finalMapY = this.ycor / tileHeight;
        // const finalMapX = this.xcor / tileWidth;
        // if ([[-0.4999, -0.4999], [-0.4999, 0], [-0.4999, 0.4999],
        //         [0, -0.4999], [0, 0], [0, 0.4999],
        //         [0.4999, -0.4999], [0.4999, 0], [0.4999, 0.4999]].every(cor =>
        //             ~voids.indexOf(
        //                 levelMap[
        //                     Math.floor(finalMapY + cor[0])
        //                 ][
        //                     Math.floor(finalMapX + cor[1])
        //                 ]) != 0)) {
        //     return false;
        //
        //         };

        return true;
    }



    getBlob() {
        return {
            pos: {
                x: this.xcor - playerWidth / 2 + widthOffset,
                y: this.ycor - playerHeight / 2 + heightOffset,
                heading: getBlobHeading(this.heading),
                w: playerWidth,
                h: playerHeight
            } as IShape,
            resourceId: 'player1'
        } as IRenderableImage;
    }
}
