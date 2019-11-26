"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("./player");
var monster_1 = require("./monster");
var gameRenderData_1 = require("../api/gameRenderData");
var levelData_1 = require("../api/levelData");
var unableToLevelResponse = {
    error: 'Unable to level',
};
var Game = /** @class */ (function () {
    function Game() {
        this.teamColor = null;
        this.maxLives = 5;
        this.score = 0;
        this.currentLevel = 0;
        this.livesLeft = this.maxLives;
        this.ableToLevel = false;
    }
    Game.prototype.changeTeam = function (team) {
        this.teamColor = team;
        this.ableToLevel = true;
        return true;
    };
    Game.prototype.levelUp = function () {
        if (this.ableToLevel) {
            this.ableToLevel = false;
            this.currentLevel += 1;
            this.bullets = [];
            this.monsters = [];
            this.levelData = levelData_1.getLevelData(this.currentLevel);
            var playerData = this.levelData.playerLocation;
            this.player = new player_1.Player(playerData.x, playerData.y, 0);
            this.monsters = this.levelData.enemyLocation.map(function (m) { return new monster_1.Monster(m.x, m.y, m.h, m.class); });
            this.lastUpdated = Date.now();
            return this.getBlob();
        }
        return unableToLevelResponse;
    };
    Game.prototype.updateBullets = function (timeDelta) {
        var counter = 0;
        var increment = 1;
        while (counter + increment < timeDelta) {
            this.incrementalUpdateBullets(increment);
        }
        this.incrementalUpdateBullets(timeDelta - counter);
    };
    Game.prototype.bulletEntityOverlap = function (b, o) {
        return (Math.abs(b.xcor - o.xcor) < 22.5) && (Math.abs(b.ycor - o.ycor) < 22.5);
    };
    Game.prototype.incrementalUpdateBullets = function (timeDelta) {
        var _this = this;
        var bullets = [];
        var _loop_1 = function (b) {
            if (b.update(timeDelta, this_1.levelData.mapData)) {
                if (b.getFiredByPlayer()) {
                    var aliveMonsters = this_1.monsters.filter(function (m) { return !_this.bulletEntityOverlap(b, m); });
                    if (aliveMonsters.length != this_1.monsters.length) {
                        this_1.monsters = aliveMonsters;
                    }
                    else {
                        bullets.push(b);
                    }
                }
                else if (this_1.bulletEntityOverlap(b, this_1.player)) {
                    this_1.gameCommand = gameRenderData_1.GameCommand.MALLOW_HURT;
                    this_1.livesLeft -= 1;
                }
                else {
                    bullets.push(b);
                    ;
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            _loop_1(b);
        }
        this.bullets = bullets;
    };
    Game.prototype.update = function (up, down, left, right, fire) {
        var _this = this;
        var currentTime = Date.now();
        var timeDelta = (currentTime - this.lastUpdated) / 240;
        this.player.update(timeDelta, up, down, left, right, this.levelData.mapData);
        this.monsters.forEach(function (m) {
            var bullet = m.update();
            if (bullet) {
                console.log('new bullet');
                _this.bullets.push(bullet);
            }
        });
        this.updateBullets(timeDelta);
        if (fire) {
            var bullet = this.player.fireBullet();
            if (bullet) {
                this.bullets.push(bullet);
            }
        }
        if (this.monsters.length == 0) {
            if (this.currentLevel == levelData_1.getLevelCount()) {
                this.gameCommand = gameRenderData_1.GameCommand.FINAL_WIN;
            }
            else {
                this.gameCommand = gameRenderData_1.GameCommand.WIN;
                this.ableToLevel = true;
            }
        }
        if (this.livesLeft == 0) {
            this.gameCommand = gameRenderData_1.GameCommand.MALLOW_DEATH;
        }
        this.lastUpdated = currentTime;
        console.log(this.getBlob());
        return this.getBlob();
    };
    Game.prototype.getBlob = function () {
        var output = {
            currentLevel: this.currentLevel,
            score: this.score,
            teamColor: this.teamColor,
            livesLeft: this.livesLeft,
            gameCommand: this.gameCommand,
            playSound: [],
            imagesToRender: {
                player1: this.player.getBlob(),
                background: {
                    pos: { x: 0, y: 0 },
                    resourceId: "background",
                },
            },
            bullets: this.bullets.map(function (b) { return b.getBlob(); }),
            monsters: this.monsters.map(function (m) { return m.getBlob(); }),
        };
        this.gameCommand = null;
        return output;
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map