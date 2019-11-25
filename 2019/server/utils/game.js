"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("./player");
var Game = /** @class */ (function () {
    function Game() {
        this.teamColor = null;
        // monsters: Monster[];
        this.maxLives = 3;
        this.lastUpdated = Date.now();
        this.player = new player_1.Player(350, 350, 0);
        this.bullets = [];
        this.score = 0;
        this.currentLevel = 1;
        this.livesLeft = this.maxLives;
    }
    Game.prototype.changeTeam = function (team) {
        this.teamColor = team;
        return true;
    };
    Game.prototype.update = function (left, right, forward, fire) {
        var currentTime = Date.now();
        var timeDelta = (currentTime - this.lastUpdated) / 250;
        this.player.update(timeDelta, left, right, forward);
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
            monsters: []
            // tiles : {
            //
            // }
            //player: this.player.getBlob(),
            // bullets: this.bullets.map((b) => b.getBlob()),
        };
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map