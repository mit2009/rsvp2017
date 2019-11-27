"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levelData_1 = require("../api/levelData");
var Bullet = /** @class */ (function () {
    function Bullet(xcor, ycor, heading, playerFired, maxBounces) {
        if (maxBounces === void 0) { maxBounces = 1; }
        this.velocity = 30;
        this.xcor = xcor;
        this.ycor = ycor;
        this.deltaX = this.velocity * Math.sin(heading);
        this.deltaY = -this.velocity * Math.cos(heading);
        this.playerFired = playerFired;
        this.bounces = 0;
        this.maxBounces = maxBounces;
    }
    Bullet.prototype.getFiredByPlayer = function () {
        return this.playerFired;
    };
    Bullet.prototype.update = function (timeDelta, levelMap) {
        this.xcor += this.deltaX * timeDelta;
        var xmapY = Math.floor(this.ycor / levelData_1.tileHeight);
        var xmapX = Math.floor((this.xcor + (levelData_1.bulletWidth / 2) * Math.sign(this.deltaX)) / levelData_1.tileWidth);
        if ((xmapY < 0) || (xmapX < 0) || (xmapY >= levelMap.length) || (xmapX >= levelMap[xmapY].length)) {
            return false;
        }
        if (~levelData_1.walls.indexOf(levelMap[xmapY][xmapX])) {
            this.deltaX = -this.deltaX;
            this.xcor = Math.floor(this.xcor * 4) / 4 + Math.sign(this.deltaX);
            this.bounces += 1;
        }
        this.ycor += this.deltaY * timeDelta;
        var ymapY = Math.floor((this.ycor + (levelData_1.bulletHeight / 2) * Math.sign(this.deltaY)) / levelData_1.tileHeight);
        var ymapX = Math.floor(this.xcor / levelData_1.tileWidth);
        if ((ymapY < 0) || (ymapX < 0) || (ymapY >= levelMap.length) || (ymapX >= levelMap[ymapY].length)) {
            return false;
        }
        if (~levelData_1.walls.indexOf(levelMap[ymapY][ymapX])) {
            this.deltaY = -this.deltaY;
            this.ycor = Math.floor(this.ycor * 4) / 4 + Math.sign(this.deltaX);
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