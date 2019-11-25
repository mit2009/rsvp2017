"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levelData_1 = require("../api/levelData");
var Monster = /** @class */ (function () {
    function Monster(xcor, ycor, ai) {
        this.xcor = (xcor + 0.5) * levelData_1.tileWidth;
        this.ycor = (ycor + 0.5) * levelData_1.tileHeight;
        this.ai = ai;
    }
    Monster.prototype.getBlob = function () {
        return {
            pos: {
                x: this.xcor - levelData_1.monsterWidth / 2 + levelData_1.widthOffset,
                y: this.ycor - levelData_1.monsterHeight / 2 + levelData_1.heightOffset,
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