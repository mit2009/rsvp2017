"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bullet_1 = require("./bullet");
var angles_1 = require("./angles");
var levelData_1 = require("../api/levelData");
var Player = /** @class */ (function () {
    function Player(xcor, ycor, heading) {
        this.velocity = 10;
        this.fireFrequency = 500;
        this.xcor = (xcor + 0.5) * levelData_1.tileWidth;
        this.ycor = (ycor + 0.5) * levelData_1.tileHeight;
        this.startX = this.xcor;
        this.startY = this.ycor;
        this.lastFired = -1;
        this.heading = 0; //heading;
    }
    Player.prototype.fireBullet = function () {
        if (Date.now() - this.lastFired > this.fireFrequency) {
            this.lastFired = Date.now();
            return new bullet_1.Bullet(this.xcor, this.ycor, this.heading, true);
        }
        return false;
    };
    Player.prototype.update = function (timeDelta, up, down, left, right, levelMap) {
        var increment = 1;
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
        if (left) {
            this.heading -= 1 * timeDelta;
        }
        if (right) {
            this.heading += 1 * timeDelta;
        }
        var xVel = this.velocity * Math.sin(this.heading) * timeDelta;
        var yVel = -this.velocity * Math.cos(this.heading) * timeDelta;
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
        var mapY = Math.floor(this.ycor / levelData_1.tileHeight);
        var mapX = Math.floor(this.xcor / levelData_1.tileWidth);
        var newY = (mapY + 0.5) * levelData_1.tileHeight;
        var newX = (mapX + 0.5) * levelData_1.tileWidth;
        var nonVoidCount = 0;
        for (var _i = 0, _a = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]]; _i < _a.length; _i++) {
            var cor = _a[_i];
            var j = cor[0];
            var i = cor[1];
            if (~levelData_1.walls.indexOf(levelMap[Math.floor(mapY + j)][Math.floor(mapX + i)])) {
                var wallY = (mapY + j + 0.5) * levelData_1.tileHeight;
                var wallX = (mapX + i + 0.5) * levelData_1.tileWidth;
                if (Math.abs(this.ycor - wallY) < 30 && Math.abs(this.xcor - wallX) < 30) {
                    if (j && i) {
                        if (Math.sign(yVel) == j && Math.sign(xVel) == i) {
                            if (Math.abs(yVel) < Math.abs(xVel)) {
                                this.ycor = newY;
                                this.xcor += Math.sign(xVel);
                            }
                            else {
                                this.ycor += Math.sign(xVel);
                                this.xcor = newX;
                            }
                        }
                        else if (Math.sign(yVel) == j) {
                            this.ycor = newY;
                        }
                        else if (Math.sign(xVel) == i) {
                            this.xcor = newX;
                        }
                    }
                    else if (j) {
                        this.ycor = newY;
                    }
                    else if (i) {
                        this.xcor = newX;
                    }
                }
                continue;
            }
            if (levelData_1.voids.indexOf(levelMap[Math.floor(mapY + j)][Math.floor(mapX + i)]) == -1) {
                var voidY = (mapY + j + 0.5) * levelData_1.tileHeight;
                var voidX = (mapX + i + 0.5) * levelData_1.tileWidth;
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