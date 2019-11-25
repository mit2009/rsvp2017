"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bullet_1 = require("./bullet");
var angles_1 = require("./angles");
var levelData_1 = require("../api/levelData");
var Player = /** @class */ (function () {
    function Player(xcor, ycor, heading) {
        this.velocity = 3;
        this.xcor = (xcor + 0.5) * levelData_1.tileWidth;
        this.ycor = (ycor + 0.5) * levelData_1.tileHeight;
        this.startX = this.xcor;
        this.startY = this.ycor;
        this.heading = heading;
    }
    Player.prototype.fireBullet = function () {
        return new bullet_1.Bullet(this.xcor, this.ycor, this.heading, true);
    };
    Player.prototype.update = function (timeDelta, up, down, left, right, levelMap) {
        var increment = 10;
        var counter = 0;
        while (counter + increment < timeDelta) {
            if (!this.updateHelper(increment, up, down, left, right, levelMap)) {
                return false;
            }
            counter += increment;
        }
        return this.updateHelper(timeDelta - counter, up, down, left, right, levelMap);
    };
    Player.prototype.updateHelper = function (timeDelta, up, down, left, right, levelMap) {
        console.log(levelMap);
        if (left) {
            this.heading -= 1 * timeDelta;
        }
        if (right) {
            this.heading += 1 * timeDelta;
        }
        var xVel = this.velocity * Math.sin(this.heading) * timeDelta;
        var yVel = -this.velocity * Math.cos(this.heading) * timeDelta;
        if (up) {
            this.xcor += xVel;
            this.ycor += yVel;
        }
        if (down) {
            this.xcor -= xVel;
            this.ycor -= yVel;
        }
        var mapY = this.ycor / levelData_1.tileHeight;
        var mapX = this.xcor / levelData_1.tileWidth;
        for (var _i = 0, _a = [-0.5, 0, 0.5]; _i < _a.length; _i++) {
            var i = _a[_i];
            if (levelData_1.walls.indexOf(levelMap[Math.floor(mapX + i)][Math.floor(mapY)])) {
                this.xcor = (Math.floor(mapX) + 0.5) * levelData_1.tileWidth;
            }
            if (levelData_1.walls.indexOf(levelMap[Math.floor(mapX)][Math.floor(mapY + i)])) {
                this.ycor = (Math.floor(mapY) + 0.5) * levelData_1.tileHeight;
            }
        }
        // const finalMapY = this.ycor / tileHeight;
        // const finalMapX = this.xcor / tileWidth;
        // if any([[-0.5, -0.5], [-0.5, 0], [-0.5, 0.5],
        //         [0, -0.5], [0, 0], [0, 0.5],
        //         [0.5, -0.5], [0.5, 0], [0.5, 0.5]].map(cor => ));
        return true;
    };
    Player.prototype.getBlob = function () {
        return {
            pos: {
                x: this.xcor - levelData_1.playerWidth / 2 + levelData_1.widthOffset,
                y: this.ycor - levelData_1.playerHeight / 2 + levelData_1.heightOffset,
                heading: angles_1.getBlobHeading(this.heading),
                w: levelData_1.playerWidth,
                h: levelData_1.playerHeight
            },
            resourceId: 'player1'
        };
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map