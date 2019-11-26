"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levelData_1 = require("../api/levelData");
var Bullet = /** @class */ (function () {
    function Bullet(xcor, ycor, heading, playerFired) {
        this.maxBounces = 2;
        this.velocity = 20;
        this.xcor = xcor;
        this.ycor = ycor;
        this.deltaX = this.velocity * Math.sin(heading);
        this.deltaY = -this.velocity * Math.cos(heading);
        this.playerFired = playerFired;
        this.bounces = 0;
    }
    Bullet.prototype.update = function (timeDelta, levelMap) {
        console.log(this.deltaX * timeDelta);
        this.xcor += this.deltaX * timeDelta;
        var xmapY = Math.floor(this.ycor / levelData_1.tileHeight);
        var xmapX = Math.floor(this.xcor / levelData_1.tileHeight);
        if (~levelData_1.walls.indexOf(levelMap[xmapY][xmapX])) {
            this.deltaX = -this.deltaX;
            this.xcor = (xmapX + Math.sign(this.deltaX) + 0.5 - (Math.sign(this.deltaX) * 0.25)) * levelData_1.tileWidth;
            this.bounces += 1;
        }
        this.ycor += this.deltaY * timeDelta;
        var ymapY = Math.floor(this.ycor / levelData_1.tileHeight);
        var ymapX = Math.floor(this.xcor / levelData_1.tileHeight);
        if (~levelData_1.walls.indexOf(levelMap[ymapY][ymapX])) {
            this.deltaY = -this.deltaY;
            this.ycor = (ymapY + Math.sign(this.deltaY) + 0.5 - (Math.sign(this.deltaY) * 0.25)) * levelData_1.tileHeight;
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