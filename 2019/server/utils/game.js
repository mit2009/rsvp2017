"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("./player");
var monster_1 = require("./monster");
var levelData_1 = require("../api/levelData");
var Game = /** @class */ (function () {
    function Game() {
        this.teamColor = null;
        this.maxLives = 3;
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
        this.ableToLevel = false;
        this.currentLevel += 1;
        this.bullets = [];
        this.monsters = [];
        this.levelData = levelData_1.getLevelData(this.currentLevel);
        var playerData = this.levelData.playerLocation;
        this.player = new player_1.Player(playerData.x, playerData.y, 0);
        this.monsters = this.levelData.enemyLocation.map(function (m) { return new monster_1.Monster(m.x, m.y, 1); });
        this.lastUpdated = Date.now();
        return this.getBlob();
    };
    Game.prototype.update = function (up, down, left, right, fire) {
        var currentTime = Date.now();
        var timeDelta = (currentTime - this.lastUpdated) / 250;
        this.player.update(timeDelta, up, down, left, right, this.levelData.mapData);
        this.bullets = this.bullets.filter(function (b) { return b.update(timeDelta); });
        if (fire) {
            this.bullets.push(this.player.fireBullet());
        }
        this.lastUpdated = currentTime;
    };
    Game.prototype.getBlob = function () {
        return {
            currentLevel: this.currentLevel,
            score: this.score,
            teamColor: this.teamColor,
            livesLeft: this.livesLeft,
            playSound: [],
            imagesToRender: {
                'player1': this.player.getBlob()
            },
            bullets: this.bullets.map(function (b) { return b.getBlob(); }),
            monsters: this.monsters.map(function (m) { return m.getBlob(); }),
        };
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map