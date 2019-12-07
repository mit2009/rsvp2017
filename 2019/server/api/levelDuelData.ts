import { IGameRenderData, TeamColor } from "./gameRenderData";
import { Coordinate } from "./levelData";

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
    //tslint:disable-next-line:prettier
    1: [1, 1, 15, 15, 15, 15, 15, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 15, 15, 15, 15, 15, 1, 1, 1, 15, 15, 2, 2, 2, 15, 15, 1, 15, 15, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 1, 15, 15, 2, 2, 2, 15, 15, 1, 15, 15, 2, 2, 2, 2, 2, 15, 15, 15, 2, 2, 9, 2, 9, 2, 9, 2, 9, 2, 15, 15, 15, 2, 2, 2, 2, 2, 15, 15, 15, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 15, 15, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 15, 15, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 15, 15, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 15, 15, 2, 2, 2, 16, 2, 11, 2, 16, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 16, 2, 11, 2, 16, 2, 2, 2, 15, 15, 2, 2, 2, 16, 2, 2, 2, 16, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 16, 2, 2, 2, 16, 2, 2, 2, 15, 15, 2, 5, 2, 15, 15, 15, 15, 15, 15, 2, 7, 2, 7, 2, 7, 2, 7, 2, 2, 15, 15, 15, 15, 15, 15, 2, 5, 2, 15, 15, 2, 2, 2, 15, 1, 1, 1, 1, 15, 15, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 1, 1, 1, 1, 15, 2, 2, 2, 15, 16, 15, 15, 15, 16, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 16, 15, 15, 15, 16],
    //tslint:disable-next-line:prettier
    4: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 19, 19, 19, 19, 19, 19, 19, 19, 1, 1, 1, 4, 13, 13, 13, 4, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 19, 19, 19, 1, 4, 13, 5, 13, 4, 8, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 19, 1, 4, 13, 13, 13, 4, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 19, 19, 4, 2, 2, 2, 4, 4, 1, 1, 2, 6, 2, 1, 1, 2, 2, 6, 2, 1, 1, 2, 6, 2, 1, 1, 2, 6, 2, 2, 2, 19, 4, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 19, 4, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 19, 4, 2, 2, 2, 6, 2, 1, 1, 2, 6, 2, 1, 1, 2, 6, 2, 2, 1, 1, 2, 6, 2, 1, 1, 19, 19, 2, 2, 2, 19, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 19, 13, 13, 13, 19, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 10, 19, 13, 5, 13, 19, 1, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 19, 13, 13, 13, 19, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
    //tslint:disable-next-line:prettier
    3: [16, 15, 15, 15, 15, 15, 15, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 15, 15, 15, 15, 15, 15, 16, 15, 13, 13, 2, 2, 2, 16, 15, 15, 15, 16, 2, 2, 2, 2, 2, 2, 2, 2, 16, 15, 15, 15, 16, 2, 2, 2, 13, 13, 15, 15, 13, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 15, 15, 2, 2, 6, 2, 2, 2, 18, 18, 18, 2, 9, 2, 7, 2, 2, 7, 2, 9, 2, 19, 19, 19, 2, 2, 2, 6, 2, 2, 15, 15, 2, 2, 2, 2, 2, 2, 18, 1, 18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 19, 1, 19, 2, 2, 2, 2, 2, 2, 15, 15, 2, 2, 2, 2, 6, 2, 18, 18, 18, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 19, 19, 19, 2, 6, 2, 2, 2, 2, 15, 15, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 2, 2, 5, 2, 2, 2, 2, 2, 7, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 7, 2, 2, 2, 2, 2, 5, 2, 2, 15, 15, 13, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 15, 15, 13, 13, 2, 2, 2, 16, 15, 15, 15, 15, 16, 2, 2, 2, 2, 2, 2, 16, 15, 15, 15, 15, 16, 2, 2, 2, 13, 13, 15, 16, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 16],
    //tslint:disable-next-line:prettier
    2: [1, 1, 18, 18, 18, 18, 18, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 1, 1, 1, 18, 18, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 18, 18, 1, 18, 18, 2, 2, 2, 6, 2, 17, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 18, 18, 18, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 17, 17, 17, 13, 13, 13, 17, 17, 17, 2, 2, 2, 5, 2, 2, 18, 18, 2, 2, 6, 2, 6, 2, 17, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 18, 18, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 18, 18, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 18, 18, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 17, 2, 6, 2, 6, 2, 2, 18, 18, 2, 2, 5, 2, 2, 2, 17, 17, 17, 13, 13, 13, 17, 17, 17, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 2, 2, 18, 18, 18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 17, 2, 6, 2, 2, 2, 18, 18, 1, 18, 18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 17, 2, 2, 2, 2, 18, 18, 1, 1, 1, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 1, 1],

};

// convert to a sensible grid format
function toMatrix(arr: number[], width: number) {
    return arr.reduce((rows, key, index) => {
        let k;
        if (key === 13 || key === 14) {
            k = 2;
        } else if (key >= 15 && key <= 19) {
            k = 4;
        } else {
            k = key;
        }
        return (
            (index % width === 0 ? rows.push([k]) : rows[rows.length - 1].push(k)) &&
            rows
        );
    }, []);
}

function toMatrixTexture(arr: number[], width: number) {
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

export function getLevelTexture(level: number) {
    return toMatrixTexture(levelMap[level], gridWidth);
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
    player1Color?: TeamColor;
    player2Color?: TeamColor;
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
    const playerLocation = [];
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
