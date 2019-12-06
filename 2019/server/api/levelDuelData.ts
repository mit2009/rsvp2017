import { Coordinate } from "./levelData";
import { IGameRenderData, TeamColor } from "./gameRenderData";

export interface ILevelMap {
    [level: number]: number[];
}

// Tile Definitions
// --------------------
// 0: nothing
// 1: floor
// 2: short wall
// 3: tall wall
// 4: player starting location
// 5: enemy starting location
// 6: fixed shooting enemy: shoots up
// 7: fixed shooting enemy: shoots right
// 8: fixed shooting enemy: shoots down
// 9: fixed shooting enemy: shoots left

// levels are formatted so they're easy to edit with a software called
// TILED the free tile editing software

// level software can be found here: https://thorbjorn.itch.io/tiled?download

export const gridWidth = 30;
export const gridHeight = 12;

export const tileWidth = 60;
export const tileHeight = 60;

export const widthOffset = tileWidth;
export const heightOffset = tileHeight;

export const playerWidth = 60;
export const playerHeight = 60;

export const bulletWidth = 30;
export const bulletHeight = 30;

export const monsterWidth = 60;
export const monsterHeight = 60;

export const walls: number[] = [3, 4];
export const voids: number[] = [1];

export const levelMap: ILevelMap = {
    1:
        // tslint:disable-next-line:prettier
        [
            1,
            1,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            1,
            1,
            1,
            4,
            4,
            2,
            2,
            2,
            2,
            4,
            8,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            1,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            4,
            4,
            2,
            2,
            2,
            5,
            2,
            2,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            6,
            4,
            4,
            2,
            2,
            6,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            2,
            2,
            2,
            2,
            11,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            11,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            6,
            2,
            2,
            4,
            4,
            6,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            2,
            2,
            5,
            2,
            2,
            2,
            4,
            4,
            4,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            2,
            2,
            2,
            2,
            4,
            4,
            1,
            4,
            4,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            10,
            4,
            2,
            2,
            2,
            2,
            4,
            4,
            1,
            1,
            1,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            1,
            1
        ]
};

// convert to a sensible grid format
function toMatrix(arr: number[], width: number) {
    return arr.reduce((rows, key, index) => {
        return (
            (index % width === 0
                ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows
        );
    }, []);
}

export function getLevel(level: number) {
    return toMatrix(levelMap[level], gridWidth);
}

export interface LevelDuelData {
    mapData: number[][];
    playerLocation: Coordinate[];
    enemyLocation: Coordinate[];
}

export enum PageState {
    ATTRACT,
    STAGING,
    COUNTDOWN,
    PLAYING,
    SCORING
}

export interface IDuelStateSocketData {
    pageState: PageState;
    player1Ready?: boolean;
    player2Ready?: boolean;
    countDownValue?: number;
    gameData?: IGameRenderData;
}

// export interface Coordinate {
//     x: number;
//     y: number;
//     h: number;
//     class?: number;
// }

// when users are ready
// socket name: duelUpdate
// users send: {
//     user: 0,
//     command: GO_TO_COUNTDOWN
// }

export enum Command {
    RESET_TO_ATTRACT,
    GO_TO_STAGING,
    GO_TO_COUNTDOWN,
    GO_TO_PLAYING,
    UPDATE_CONTROLS,
    GET_FRAME,
    GO_TO_SCORING
}

export type DuelPlayer = 0 | 1 | -1;

export interface IDuelSocketCommand {
    user: DuelPlayer;
    command: Command;
    params?: {
        player0Color?: TeamColor;
        player1Color?: TeamColor;
        levelNumber?: number;
        countDownValue?: number;
        controls?: boolean[];
    };
}

export function getLevelCount() {
    return Object.keys(levelMap).length;
}

export function getLevelData(level: number) {
    const mapData = getLevel(level);
    let playerLocation = [];
    const enemyLocation = [];

    for (let j = 0; j < gridWidth; j++) {
        for (let i = 0; i < gridHeight; i++) {
            if (mapData[i][j] === 5) {
                playerLocation.push({ x: j, y: i, h: 0 });
                mapData[i][j] = 2;
            }
            if (mapData[i][j] === 6) {
                enemyLocation.push({ x: j, y: i, h: Math.PI, class: 6 });
                mapData[i][j] = 2;
            }
            if (mapData[i][j] === 7) {
                enemyLocation.push({ x: j, y: i, h: 0, class: 7 });
                mapData[i][j] = 2;
            }
            if (mapData[i][j] === 8) {
                enemyLocation.push({ x: j, y: i, h: Math.PI / 2, class: 8 });
                mapData[i][j] = 2;
            }
            if (mapData[i][j] === 9) {
                enemyLocation.push({ x: j, y: i, h: Math.PI, class: 9 });
                mapData[i][j] = 2;
            }
            if (mapData[i][j] === 10) {
                enemyLocation.push({
                    x: j,
                    y: i,
                    h: (Math.PI * 3) / 2,
                    class: 10
                });
                mapData[i][j] = 2;
            }
            if (mapData[i][j] === 11) {
                enemyLocation.push({ x: j, y: i, h: 0, class: 11 });
                mapData[i][j] = 2;
            }
        }
    }
    // everything is broken fix it
    //
    return {
        mapData,
        playerLocation,
        enemyLocation
    } as LevelDuelData;
}
