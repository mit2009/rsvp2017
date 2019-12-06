import { Bullet } from "./duelBullet";
import { Bullet as OldBullet } from "./bullet";
import { Player } from "./duelPlayer";
import { Monster } from "./duelMonster";
import {
    TeamColor,
    IGameRenderData,
    GameCommand,
    PlayMode,
    ISoundClip
} from "../api/gameRenderData";
import { getLevelData, LevelDuelData, DuelPlayer } from "../api/levelDuelData";

const SOUNDS = {
    bulletShoot: "bulletShoot",
    enemyHurt: "enemyHurt",
    playerHurt: "playerHurt",
    playerDie: "playerDie",
    levelFinish: "levelUp",
    levelStart: "levelStart"
};

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

export class Duel {
    countDown: number;
    lastUpdated: number;
    players: Player[] = [];
    bullets: Bullet[] = [];
    monsters: Monster[] = [];
    levelData: LevelDuelData;
    playSound: ISoundClip[] = [];
    levelNumber: number;

    gameCommand: GameCommand;
    nextCommand: GameCommand;
    allowSending: boolean;

    final: boolean;

    constructor(player0: TeamColor, player1: TeamColor, levelNumber: number) {
        this.levelData = getLevelData(levelNumber);
        this.levelNumber = levelNumber;
        const { playerLocation, enemyLocation } = this.levelData;
        this.players.push(
            new Player(playerLocation[0].x, playerLocation[0].y, 0, player0, 0)
        );
        this.players.push(
            new Player(playerLocation[1].x, playerLocation[1].y, 0, player1, 1)
        );
        this.monsters = enemyLocation.map(
            m => new Monster(m.x, m.y, m.h, m.class)
        );
    }

    start() {
        this.lastUpdated = Date.now();
        return this.getBlob();
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
        return (
            Math.abs(b.xcor - o.xcor) < overlap &&
            Math.abs(b.ycor - o.ycor) < overlap
        );
    }

    incrementalUpdateBullets(timeDelta: number) {
        const bullets: Bullet[] = [];
        for (let b of this.bullets) {
            if (b.update(timeDelta, this.levelData.mapData)) {
                // if (b.getFiredByPlayer()) {
                //     const aliveMonsters = this.monsters.filter(
                //         m => !this.bulletEntityOverlap(b, m)
                //     );
                //     if (aliveMonsters.length != this.monsters.length) {
                //         this.score +=
                //             enemyBonusScore *
                //             (this.monsters.length - aliveMonsters.length);
                //         this.monsters = aliveMonsters;
                //         this.playSound.push(singleSoundClip(SOUNDS.enemyHurt));
                //     } else {
                //         bullets.push(b);
                //     }
                // } else if (this.bulletEntityOverlap(b, this.player)) {
                //     this.nextCommand = GameCommand.MALLOW_HURT;
                //     this.playSound.push(singleSoundClip(SOUNDS.playerHurt));
                //     this.livesLeft -= 1;
                // } else {
                //     bullets.push(b);
                // }
            }
        }
        this.bullets = bullets;
    }

    updateControl(user: DuelPlayer, controls: boolean[]) {
        this.players[user].updateControls(controls);
    }

    update() {
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdated) / 200;

        this.players.forEach(p => {
            p.update(timeDelta, this.levelData.mapData);
        });
        this.monsters = this.monsters.filter(m => {
            const bullet = m.update();
            if (bullet) {
                this.bullets.push(bullet);
            }
            return this.players.every(p => {
                const collide = this.bulletEntityOverlap(m, p);
                if (collide) {
                    p.score += enemyBonusScore;
                    return false;
                }
                return true;
            });
        });
        this.updateBullets(timeDelta);

        if (this.gameCommand != null) {
            if (this.allowSending) {
                this.nextCommand = this.gameCommand;
                this.gameCommand = null;
                this.allowSending = false;
            } else {
                this.allowSending = true;
            }
        }

        this.lastUpdated = currentTime;
        const blob = this.getBlob();
        console.log(blob.bullets, blob.monsters);
        return blob;
    }

    getBlob() {
        console.log("bullets:", this.bullets);

        console.log("monsters:", this.monsters);
        const output = {
            currentLevel: this.levelNumber,
            score: -1,
            teamColor: null,
            livesLeft: -1,
            gameCommand: this.nextCommand,
            playSound: this.playSound,
            imagesToRender: {
                player1: this.players[0].getBlob(),
                player2: this.players[1].getBlob(),
                background: {
                    pos: { x: 0, y: 0 },
                    resourceId: "background"
                }
            },
            bullets: this.bullets.map(b => b.getBlob()),
            monsters: this.monsters.map(m => m.getBlob())
        } as IGameRenderData;
        this.playSound = [];
        this.nextCommand = null;
        return output;
    }
}
