import { Bullet } from "./duelBullet";
import { getBlobHeading } from "./angles";
import { IRenderableImage, IShape, TeamColor } from "../api/gameRenderData";
import {
    playerWidth,
    playerHeight,
    widthOffset,
    heightOffset,
    tileWidth,
    tileHeight,
    walls,
    voids
} from "../api/levelDuelData";

const bulletPenaltyScore = 1;
const fallingPenaltyScore = 50;

export class Player {
    private startX: number;
    private startY: number;

    public xcor: number;
    public ycor: number;
    private heading: number;

    private lastFired: number;

    public score: number;

    private velocity: number = 30;
    private turningAngle: number = 0.7;
    private fireFrequency: number = 100;

    private teamColor: TeamColor;

    public playerNumber: number;

    private up: boolean;
    private down: boolean;
    private left: boolean;
    private right: boolean;
    private fire: boolean;

    constructor(
        xcor: number,
        ycor: number,
        heading: number,
        color: TeamColor,
        playerNumber: number
    ) {
        this.xcor = (xcor + 0.5) * tileWidth;
        this.ycor = (ycor + 0.5) * tileHeight;
        this.startX = this.xcor;
        this.startY = this.ycor;

        this.teamColor = color;
        this.playerNumber = playerNumber;

        this.lastFired = -1;
        this.score = 500;

        this.heading = heading;
    }

    fireBullet() {
        if (Date.now() - this.lastFired > this.fireFrequency && this.fire) {
            this.lastFired = Date.now();
            const bulletOffset = 15;
            this.fire = false;
            this.score -= bulletPenaltyScore;
            return new Bullet(
                this.xcor + bulletOffset * Math.sin(this.heading),
                this.ycor - bulletOffset * Math.cos(this.heading),
                this.heading,
                this.playerNumber
            );
        }
        return false;
    }

    updateControls(controls: boolean[]) {
        this.up = controls[0];
        this.down = controls[1];
        this.left = controls[2];
        this.right = controls[3];
        if (controls[4]) {
            this.fire = true;
        }
    }

    update(timeDelta: number, levelMap: number[][], customX: number = 0, customY: number = 0) {
        const increment = 1;
        let counter = 0;

        while (counter + increment < timeDelta) {
            if (
                !this.updateHelper(
                    increment,
                    this.up,
                    this.down,
                    this.left,
                    this.right,
                    levelMap,
                    customX,
                    customY,
                )
            ) {
                return false;
            }
            counter += increment;
        }

        return this.updateHelper(
            timeDelta - counter,
            this.up,
            this.down,
            this.left,
            this.right,
            levelMap,
            customX,
            customY,
        );
    }

    updateHelper(
        timeDelta: number,
        up: boolean,
        down: boolean,
        left: boolean,
        right: boolean,
        levelMap: number[][],
        customX: number,
        customY: number,
    ) {
        if (left) {
            this.heading -= this.turningAngle * timeDelta;
        }
        if (right) {
            this.heading += this.turningAngle * timeDelta;
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
        if (!(up || down) && (left || right) && !(left && right)) {
            this.xcor += xVel * 0.3;
            this.ycor += yVel * 0.3;
        }
        if (up || down) {
            this.xcor += xVel;
            this.ycor += yVel;
        }

        this.xcor += customX;
        this.ycor += customY;

        const mapY = Math.floor(this.ycor / tileHeight);
        const mapX = Math.floor(this.xcor / tileWidth);
        const newY = (mapY + 0.5) * tileHeight;
        const newX = (mapX + 0.5) * tileWidth;

        let nonVoidCount = 0;
        for (let cor of [
            [0, 0],
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1]
        ]) {
            const j = cor[0];
            const i = cor[1];
            if (
                mapY + j < 0 ||
                mapX + i < 0 ||
                mapY + j >= levelMap.length ||
                mapX + i >= levelMap[mapY + j].length
            ) {
                continue;
            }
            if (~walls.indexOf(levelMap[mapY + j][mapX + i])) {
                const wallY = (mapY + j + 0.5) * tileHeight;
                const wallX = (mapX + i + 0.5) * tileWidth;
                if (
                    Math.abs(this.ycor - wallY) < 60 &&
                    Math.abs(this.xcor - wallX) < 60
                ) {
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
            if (voids.indexOf(levelMap[mapY + j][mapX + i]) == -1) {
                const voidY = (mapY + j + 0.5) * tileHeight;
                const voidX = (mapX + i + 0.5) * tileWidth;
                if (
                    Math.abs(this.ycor - voidY) < 30 &&
                    Math.abs(this.xcor - voidX) < 30
                ) {
                    nonVoidCount += 1;
                }
            }
        }

        if (nonVoidCount == 0) {
            this.score -= fallingPenaltyScore;
            this.xcor = this.startX;
            this.ycor = this.startY;
            return false;
        }
        return true;
    }

    getBlob() {
        if (this.score < 0) {
            this.score = 0;
        }
        // console.log("SCORES", this.playerNumber, this.score);
        return {
            pos: {
                x: this.xcor - playerWidth / 2 + widthOffset,
                y: this.ycor - playerHeight / 2 + heightOffset,
                heading: getBlobHeading(this.heading),
                w: playerWidth,
                h: playerHeight,
                color: this.teamColor
            } as IShape,
            resourceId: "player1",
            score: this.score
        } as IRenderableImage;
    }
}
