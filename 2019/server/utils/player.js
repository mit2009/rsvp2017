"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bullet_1 = require("./bullet");
var angles_1 = require("./angles");
var levelData_1 = require("../api/levelData");
var Player = /** @class */ (function () {
    function Player(xcor, ycor, heading) {
        this.velocity = 50;
        this.xcor = (xcor + 0.5) * levelData_1.tileWidth;
        this.ycor = (ycor + 0.5) * levelData_1.tileHeight;
        this.heading = heading;
    }
    Player.prototype.fireBullet = function () {
        return new bullet_1.Bullet(this.xcor, this.ycor, this.heading, true);
    };
    Player.prototype.update = function (timeDelta, up, down, left, right, levelMap) {
        console.log(down, levelMap);
        if (left) {
            this.heading -= 1 * timeDelta;
        }
        if (right) {
            this.heading += 1 * timeDelta;
        }
        if (up) {
            this.xcor += this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor -= this.velocity * Math.cos(this.heading) * timeDelta;
        }
        if (down) {
            this.xcor -= this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor += this.velocity * Math.cos(this.heading) * timeDelta;
        }
    };
    Player.prototype.getBlobHeading = function () {
        var degreesHeading = angles_1.radians_to_degrees(this.heading);
        degreesHeading = degreesHeading % 360;
        degreesHeading = (degreesHeading + 360 + 22.5) % 360;
        return Math.floor(degreesHeading / 45);
    };
    Player.prototype.getBlob = function () {
        return {
            pos: {
                x: this.xcor - levelData_1.playerWidth / 2 + levelData_1.widthOffset,
                y: this.ycor - levelData_1.playerHeight / 2 + levelData_1.heightOffset,
                heading: this.getBlobHeading(),
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