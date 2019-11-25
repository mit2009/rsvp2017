import { Bullet } from "./bullet";
import { Player } from "./player";
import { TeamColor, IGameRenderData } from "../api/gameRenderData"

export class Game {
    lastUpdated: number;

    teamColor: TeamColor = null;

    currentLevel: number;
    score: number;

    livesLeft: number;

    player: Player;
    bullets: Bullet[];
    // monsters: Monster[];

    maxLives: number = 3;

    constructor() {
        this.lastUpdated = Date.now();
        this.player = new Player(350, 350, 0);
        this.bullets = [];

        this.score = 0;
        this.currentLevel = 1;
        this.livesLeft = this.maxLives;
    }

    changeTeam(team: TeamColor) {
        this.teamColor = team;
        return true;
    }

    update(left: boolean, right: boolean, forward: boolean, fire: boolean) {
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdated) / 250

        this.player.update(timeDelta, left, right, forward);

        this.bullets = this.bullets.filter((b) => b.update(timeDelta));

        if (fire) {
            this.bullets.push(this.player.fireBullet());
        }

        this.lastUpdated = currentTime;
    }

    getBlob() {
        return {
            currentLevel: this.currentLevel,
            score: this.score,
            teamColor: this.teamColor,
            livesLeft: this.livesLeft,
            playSound: [],
            imagesToRender: {
                'player1': this.player.getBlob()
            },
            bullets: this.bullets.map(b => b.getBlob()),
            monsters: []
            // tiles : {
            //
            // }
            //player: this.player.getBlob(),
            // bullets: this.bullets.map((b) => b.getBlob()),
        } as IGameRenderData
    }
}
