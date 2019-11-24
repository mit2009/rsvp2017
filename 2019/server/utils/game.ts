import { Bullet } from "./bullet";
import { Player } from "./player";

export class Game {
    lastUpdated: number;

    score: number;

    level: number;

    player: Player;
    bullets: Bullet[];

    constructor() {
        this.lastUpdated = Date.now();
        this.player = new Player(350, 350, 0);
        this.bullets = [];

        this.score = 0;
        this.level = 1;
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
            player: this.player.getBlob(),
            bullets: this.bullets.map((b) => b.getBlob()),
        }
    }
}
