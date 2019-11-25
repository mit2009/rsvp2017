"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bullet_1 = require("./bullet");
var Player = /** @class */ (function () {
    function Player(xcor, ycor, heading) {
        this.velocity = 50;
        this.xcor = xcor;
        this.ycor = ycor;
        this.heading = heading;
    }
    Player.prototype.fireBullet = function () {
        return new bullet_1.Bullet(this.xcor, this.ycor, this.heading, true);
    };
    Player.prototype.update = function (timeDelta, left, right, forward) {
        if (left) {
            this.heading -= 1 * timeDelta;
        }
        if (right) {
            this.heading += 1 * timeDelta;
        }
        if (forward) {
            console.log("here");
            this.xcor += this.velocity * Math.sin(this.heading) * timeDelta;
            this.ycor -= this.velocity * Math.cos(this.heading) * timeDelta;
        }
    };
    Player.prototype.getBlob = function () {
        return {
            pos: {
                x: this.xcor,
                y: this.ycor,
                heading: this.heading
            }
        };
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map