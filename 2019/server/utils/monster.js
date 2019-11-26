"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angles_1 = require("./angles");
var bullet_1 = require("./bullet");
var levelData_1 = require("../api/levelData");
var AIs = {
    6: [{ delay: 1, deltaHeading: 0, fire: false }],
    7: [{ delay: 1000, deltaHeading: 0, fire: true }],
    8: [{ delay: 1000, deltaHeading: 0, fire: true }],
    9: [{ delay: 1000, deltaHeading: 0, fire: true }],
    10: [{ delay: 1000, deltaHeading: 0, fire: true }],
    11: [{ delay: 500, deltaHeading: Math.PI / 4, fire: true }],
};
var Monster = /** @class */ (function () {
    function Monster(xcor, ycor, heading, ai) {
        this.xcor = (xcor + 0.5) * levelData_1.tileWidth;
        this.ycor = (ycor + 0.5) * levelData_1.tileHeight;
        this.heading = heading;
        this.ai = ai;
        this.lastAction = 0;
        this.lastActionTime = Date.now();
    }
    Monster.prototype.update = function () {
        var ai = AIs[this.ai];
        var lastAct = ai[this.lastAction];
        if (Date.now() - this.lastActionTime > lastAct.delay) {
            this.heading += lastAct.deltaHeading;
            this.lastAction = (this.lastAction + 1) % ai.length;
            this.lastActionTime = Date.now();
            if (lastAct.fire) {
                return this.fireBullet();
            }
        }
        return false;
    };
    Monster.prototype.fireBullet = function () {
        var bulletOffset = 0;
        return new bullet_1.Bullet(this.xcor + bulletOffset * Math.sin(this.heading), this.ycor - bulletOffset * Math.cos(this.heading), this.heading, false, 0);
    };
    Monster.prototype.getBlob = function () {
        return {
            pos: {
                x: this.xcor - levelData_1.monsterWidth / 2 + levelData_1.widthOffset,
                y: this.ycor - levelData_1.monsterHeight / 2 + levelData_1.heightOffset,
                heading: angles_1.getBlobHeading(this.heading),
                w: levelData_1.monsterWidth,
                h: levelData_1.monsterHeight
            },
            resourceId: 'monster1'
        };
    };
    return Monster;
}());
exports.Monster = Monster;
//# sourceMappingURL=monster.js.map