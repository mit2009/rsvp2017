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

    velocity: number = 10;
    turningAngle: number;

    constructor(xcor: number, ycor: number, heading: number) {
        this.xcor = (xcor + 0.5) * tileWidth;
        this.ycor = (ycor + 0.5) * tileHeight;
        this.startX = this.xcor;
        this.startY = this.ycor;

        this.heading = 0; //heading;
    }

    fireBullet() {
        return new Bullet(this.xcor, this.ycor, this.heading, true);
    }

    update(timeDelta: number, up: boolean, down: boolean, left: boolean, right: boolean, levelMap: number[][]) {
        const increment = 1;
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

        let xVel = this.velocity * Math.sin(this.heading) * timeDelta;
        let yVel = -this.velocity * Math.cos(this.heading) * timeDelta;

        if (up && down) {
            xVel = 0;
            yVel = 0;
        }
        if (up) {
            xVel = xVel;
            yVel = yVel;
        }
        if (down) {
            xVel = -xVel;
            yVel = -yVel;
        }
        if (up || down) {
            this.xcor += xVel;
            this.ycor += yVel;
        }

        const mapY = Math.floor(this.ycor / tileHeight);
        const mapX = Math.floor(this.xcor / tileWidth);
        const newY = (mapY + 0.5) * tileHeight;
        const newX = (mapX + 0.5) * tileWidth;

        let nonVoidCount = 0;
        for (let cor of [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]) {
            const j = cor[0];
            const i = cor[1];
            if (~walls.indexOf(levelMap[Math.floor(mapY + j)][Math.floor(mapX + i)])) {
                const wallY = (mapY + j + 0.5) * tileHeight;
                const wallX = (mapX + i + 0.5) * tileWidth;
                if (Math.abs(this.ycor - wallY) < 30 && Math.abs(this.xcor - wallX) < 30) {
                    if (j && i) {
                        if (Math.sign(yVel) == j && Math.sign(xVel) == i) {
                            if (Math.abs(yVel) < Math.abs(xVel)) {
                                this.ycor = newY;
                                this.xcor += Math.sign(xVel);
                            } else {
                                this.ycor += Math.sign(xVel);
                                this.xcor = newX;
                            }
                        } else if (Math.sign(yVel) == j) {
                            this.ycor = newY;
                        } else if (Math.sign(xVel) == i) {
                            this.xcor = newX;
                        }
                    } else if (j) {
                        this.ycor = newY;
                    } else if (i) {
                        this.xcor = newX;
                    }
                }
                continue;
            }
            if (voids.indexOf(levelMap[Math.floor(mapY + j)][Math.floor(mapX + i)]) == -1) {
                const voidY = (mapY + j + 0.5) * tileHeight;
                const voidX = (mapX + i + 0.5) * tileWidth;
                if (Math.abs(this.ycor - voidY) < 30 && Math.abs(this.xcor - voidX) < 30) {
                    nonVoidCount += 1;
                }
            }
        }

        if (nonVoidCount == 0) {
            this.xcor = this.startX;
            this.ycor = this.startY;
            return false;
        }

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
