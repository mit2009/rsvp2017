import { Bullet } from "./bullet";
import { Player } from "./player";
import { Monster } from "./monster";
import { TeamColor, IGameRenderData, GameCommand } from "../api/gameRenderData"
import { LevelData, getLevelData } from "../api/levelData"

const unableToLevelResponse = {
    error: 'Unable to level',
}

export class Game {

    teamColor: TeamColor = null;

    currentLevel: number;
    score: number;
    livesLeft: number;

    maxLives: number = 5;

    ableToLevel: boolean;

    lastUpdated: number;
    player: Player;
    bullets: Bullet[];
    levelData: LevelData;
    monsters: Monster[];
    gameCommand: GameCommand;

    constructor() {
        this.score = 0;
        this.currentLevel = 0;
        this.livesLeft = this.maxLives;

        this.ableToLevel = false;
    }

    changeTeam(team: TeamColor) {
        this.teamColor = team;
        this.ableToLevel = true;
        return true;
    }

    levelUp() {
        if (this.ableToLevel) {
            this.ableToLevel = false;
            this.currentLevel += 1;

            this.bullets = [];
            this.monsters = [];

            this.levelData = getLevelData(this.currentLevel);
            const playerData = this.levelData.playerLocation;

            this.player = new Player(playerData.x, playerData.y, 0);
            this.monsters = this.levelData.enemyLocation.map(m => new Monster(m.x, m.y, 0, 1));

            this.lastUpdated = Date.now();
            return this.getBlob()
        }

        return unableToLevelResponse;
    }

    updateBullets(timeDelta: number) {
        let counter = 0;
        let increment = 1;
        while (counter + increment < timeDelta) {
            this.incrementalUpdateBullets(increment);
        }
        this.incrementalUpdateBullets(timeDelta - counter);
    }

    bulletEntityOverlap(b: Bullet, o: any) {
        return (Math.abs(b.xcor - o.xcor) < 22.5) && (Math.abs(b.ycor - o.ycor) < 22.5);
    }

    incrementalUpdateBullets(timeDelta: number) {
        const bullets = []
        for (let b of this.bullets) {
            if (b.update(timeDelta, this.levelData.mapData)) {
                if (b.getFiredByPlayer()) {
                    const aliveMonsters = this.monsters.filter(m => !this.bulletEntityOverlap(b, m));
                    if (aliveMonsters.length != this.monsters.length) {
                        this.monsters = aliveMonsters;
                    } else {
                        bullets.push(b);
                    }
                } else if (this.bulletEntityOverlap(b, this.player)) {
                    this.gameCommand = GameCommand.MALLOW_HURT;
                    this.livesLeft -= 1;
                } else {
                    bullets.push(b);;
                }
            }
        }
        this.bullets = bullets;
    }

    update(up: boolean, down: boolean, left: boolean, right: boolean, fire: boolean) {
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdated) / 240;

        this.player.update(timeDelta, up, down, left, right, this.levelData.mapData);
        this.monsters.forEach((m) => m.update(timeDelta));
        this.updateBullets(timeDelta);

        if (fire) {
            const bullet = this.player.fireBullet();
            if (bullet) {
                this.bullets.push(bullet);
            }
        }

        if (this.monsters.length == 0) {
            this.gameCommand = GameCommand.WIN;
            this.ableToLevel = true;
        }

        if (this.livesLeft == 0) {
            this.gameCommand = GameCommand.MALLOW_DEATH;
        }

        this.lastUpdated = currentTime;

        return this.getBlob();
    }

    getBlob() {
        const output = {
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
            bullets: this.bullets.map(b => b.getBlob()),
            monsters: this.monsters.map(m => m.getBlob()),
        } as IGameRenderData
        this.gameCommand = null;
        return output;
    }
}
