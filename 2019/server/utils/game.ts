import { Bullet } from "./bullet";
import { Player } from "./player";
import { Monster } from "./monster";
import { TeamColor, IGameRenderData, GameCommand, PlayMode, ISoundClip } from "../api/gameRenderData"
import { LevelData, getLevelCount, getLevelData } from "../api/levelData"

const unableToLevelResponse = {
    error: 'Unable to level',
}

const SOUNDS = {
    bulletShoot : 'bulletShoot',
    enemyHurt : 'enemyHurt',
    playerHurt : 'playerHurt',
    playerDie : 'playerDie',
    levelFinish : 'levelUp',
    levelStart: 'levelStart',
}

function singleSoundClip(resourceId: string) {
    return {
        playMode: PlayMode.ONCE,
        resourceId
    } as ISoundClip;
}

const baseLevelScore = 100;
const deltaLevelScore = 50;
const enemyBonusScore = 50;
const bulletPenaltyScore = -1;

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
    playSound: ISoundClip[];

    final: boolean;

    constructor() {
        this.score = 1000000;
        this.currentLevel = 1;
        this.livesLeft = 1; // this.maxLives;

        this.ableToLevel = false;
        this.final = false;
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
            this.monsters = this.levelData.enemyLocation.map(m => new Monster(m.x, m.y, m.h, m.class));

            this.playSound = [singleSoundClip(SOUNDS.levelFinish)];

            this.lastUpdated = Date.now();
            const blob = this.getBlob();
            return blob;
        }

        return unableToLevelResponse;
    }

    updateBullets(timeDelta: number) {
        let counter = 0;
        let increment = 1;
        while (counter + increment < timeDelta) {
            this.incrementalUpdateBullets(increment);
            counter += increment;
        }
        this.incrementalUpdateBullets(timeDelta - counter);
    }

    bulletEntityOverlap(b: any, o: any, overlap: number = 22.5) {
        return (Math.abs(b.xcor - o.xcor) < overlap) && (Math.abs(b.ycor - o.ycor) < overlap);
    }

    incrementalUpdateBullets(timeDelta: number) {
        const bullets = []
        for (let b of this.bullets) {
            if (b.update(timeDelta, this.levelData.mapData)) {
                if (b.getFiredByPlayer()) {
                    const aliveMonsters = this.monsters.filter(m => !this.bulletEntityOverlap(b, m));
                    if (aliveMonsters.length != this.monsters.length) {
                        this.score += enemyBonusScore * (this.monsters.length - aliveMonsters.length);
                        this.monsters = aliveMonsters;
                        this.playSound.push(singleSoundClip(SOUNDS.enemyHurt));
                    } else {
                        bullets.push(b);
                    }
                } else if (this.bulletEntityOverlap(b, this.player)) {
                    this.gameCommand = GameCommand.MALLOW_HURT;
                    this.playSound.push(singleSoundClip(SOUNDS.playerHurt));
                    this.livesLeft -= 1;
                } else {
                    bullets.push(b);;
                }
            }
        }
        this.bullets = bullets;
    }

    update(up: boolean, down: boolean, left: boolean, right: boolean, fire: boolean) {
        if (this.final) {
            return this.getBlob();
        }
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdated) / 240;

        this.player.update(timeDelta, up, down, left, right, this.levelData.mapData);
        this.monsters = this.monsters.filter((m) => {
            const bullet = m.update();
            if (bullet) {
                this.bullets.push(bullet);
            }
            const collide = this.bulletEntityOverlap(m, this.player);
            if (collide) {
                this.score += enemyBonusScore;
                this.livesLeft -= 1;
                this.gameCommand = GameCommand.MALLOW_HURT;
                this.playSound.push(singleSoundClip(SOUNDS.playerHurt));
                return false;
            }
            return true;
        });
        this.updateBullets(timeDelta);

        if (fire) {
            const bullet = this.player.fireBullet();
            if (bullet) {
                this.playSound.push(singleSoundClip(SOUNDS.bulletShoot));
                this.score += bulletPenaltyScore;
                this.bullets.push(bullet);
            }
        }

        if (this.monsters.length == 0) {
            if (this.ableToLevel == false && this.final == false) {
                this.score += baseLevelScore + deltaLevelScore * (this.currentLevel);
            }
            if (this.currentLevel == getLevelCount()) {
                this.final = true;
                this.gameCommand = GameCommand.FINAL_WIN;
            } else {
                this.ableToLevel = true;
                this.gameCommand = GameCommand.WIN;
            }
            this.playSound = [singleSoundClip(SOUNDS.levelFinish)];
        }

        if (this.livesLeft <= 0) {
            this.gameCommand = GameCommand.MALLOW_DEATH;
            this.final = true;
            this.playSound = [singleSoundClip(SOUNDS.playerDie)];
        }

        if (this.score < 0) {
            this.score = 0;
        }

        this.lastUpdated = currentTime;
        const blob = this.getBlob();
        return blob;
    }

    getBlob() {
        const output = {
            currentLevel: this.currentLevel,
            score: this.score,
            teamColor: this.teamColor,
            livesLeft: this.livesLeft,
            gameCommand: this.gameCommand,
            playSound: this.playSound,
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
        this.playSound = [];
        this.gameCommand = null;
        // console.log(output);
        return output;
    }

    getScore() {
        if (this.final) {
            return this.score;
        }
        return -1;
    }

    getColor() {
        if (this.final) {
            return this.teamColor;
        }
        return -1;
    }
}
