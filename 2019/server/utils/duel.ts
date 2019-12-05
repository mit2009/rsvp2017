import { Bullet } from "./bullet";
import { Player } from "./player";
import { Monster } from "./monster";
import {
    TeamColor,
    IGameRenderData,
    GameCommand,
    PlayMode,
    ISoundClip
} from "../api/gameRenderData";
import { LevelData, getLevelCount, getLevelData } from "../api/levelData";

const unableToLevelResponse = {
    error: "Unable to level"
};

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

import { PageState, IDuelStateSocketData } from "../../app/gamePage.tsx"

const baseLevelScore = 100;
const deltaLevelScore = 50;
const enemyBonusScore = 50;
const bulletPenaltyScore = -1;

export class DUEL {
    gameState: PageState;
    lastUpdated: number;
    players: String[] = [];
    playerMap: {String: Player};
    bullets: Bullet[];
    levelData: LevelData;
    playSound: ISoundClip[];

    gameCommand: GameCommand;
    nextCommand: GameCommand;
    allowSending: boolean;

    final: boolean;

    constructor() {
        this.gameState = PageState.ATTRACT;
    }

    updateState() {
        switch(this.gameState) {
            case PageState.ATTRACT:
                break;
            case PageState.STAGING:
                break;
            case PageState.COUNTDOWN:
                break;
            case PageState.PLAYING:
                break;
            case PageState.SCORING:
                break;
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
        return (
            Math.abs(b.xcor - o.xcor) < overlap &&
            Math.abs(b.ycor - o.ycor) < overlap
        );
    }

    incrementalUpdateBullets(timeDelta: number) {
        const bullets:Bullet[] = [];
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

    update() {
        const currentTime = Date.now();
        const timeDelta = (currentTime - this.lastUpdated) / 240;

        this.players.update();
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
        return blob;
    }

    getBlob() {
        // set player 1 color
        const playerBlob = this.player.getBlob();
        playerBlob.pos.color = this.teamColor;

        const output = {
            currentLevel: -1,
            score: -1,
            teamColor: null,
            livesLeft: -1,
            gameCommand: this.nextCommand,
            playSound: this.playSound,
            imagesToRender: {
                player1: playerBlob,
                background: {
                    pos: { x: 0, y: 0 },
                    resourceId: "background"
                }
            },
            bullets: this.bullets.map(b => b.getBlob()),
            monsters: []
        } as IGameRenderData;
        this.playSound = [];
        this.nextCommand = null;
        return output;
    }
}
