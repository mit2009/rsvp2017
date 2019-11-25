"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levelData_1 = require("../api/levelData");
var Bullet = /** @class */ (function () {
    function Bullet(xcor, ycor, heading, playerFired) {
        this.maxBounces = 2;
        this.velocity = 100;
        this.xcor = xcor;
        this.ycor = ycor;
        this.deltaX = this.velocity * Math.sin(heading);
        this.deltaY = -this.velocity * Math.cos(heading);
        this.playerFired = playerFired;
        this.bounces = 0;
    }
    Bullet.prototype.update = function (timeDelta) {
        this.xcor += this.deltaX * timeDelta;
        if (this.xcor < 0 || this.xcor > 700) {
            this.deltaX = -this.deltaX;
            this.bounces += 1;
        }
        this.ycor += this.deltaY * timeDelta;
        if (this.ycor < 0 || this.ycor > 700) {
            this.deltaY = -this.deltaY;
            this.bounces += 1;
        }
        if (this.bounces > this.maxBounces) {
            return false;
        }
        return true;
    };
    Bullet.prototype.getBlob = function () {
        return {
            pos: {
                x: this.xcor - levelData_1.bulletWidth / 2 + levelData_1.widthOffset,
                y: this.ycor - levelData_1.bulletHeight / 2 + levelData_1.heightOffset,
                w: levelData_1.bulletWidth,
                h: levelData_1.bulletHeight
            },
            resourceId: 'bullet'
        };
    };
    return Bullet;
}());
exports.Bullet = Bullet;
//# sourceMappingURL=bullet.js.map