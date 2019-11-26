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

export const gridWidth = 16;
export const gridHeight = 16;

export const tileWidth = 30;
export const tileHeight = 30;

export const widthOffset = 2 * tileWidth;
export const heightOffset = 2 * tileHeight;

export const playerWidth = 30;
export const playerHeight = 30;

export const bulletWidth = 15;
export const bulletHeight = 15;

export const monsterWidth = 30;
export const monsterHeight = 30;

export const walls: number[] = [3, 4];
export const voids: number[] = [1];

export const levelMap: ILevelMap = {
    1:
        // tslint:disable-next-line: prettier
        [1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 6, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 5, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1],
    2:
        // tslint:disable-next-line: prettier
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 5, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    3:
        // tslint:disable-next-line: prettier
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 4, 1, 1, 4, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 4, 1, 1, 4, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
};

// convert to a sensible grid format
function toMatrix(arr: number[], width: number) {
    return arr.reduce((rows, key, index) => {
        return (index % width === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
    }, []);
}

export function getLevel(level: number) {
    return toMatrix(levelMap[level], gridWidth);
}

export interface LevelData {
    mapData: number[][];
    playerLocation: Coordinate;
    enemyLocation: Coordinate[];
}

export interface Coordinate {
    x: number;
    y: number;
    h: number;
}

export function getLevelData(level: number) {
    const mapData = getLevel(level);
    let playerLocation;
    const enemyLocation = [];

    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            if (mapData[i][j] === 5) {
                playerLocation = { x: j, y: i , h: 0};
                mapData[i][j] = 1;
            }
            if (mapData[i][j] === 6) {
                enemyLocation.push({ x: j, y: i, h: Math.PI });
                mapData[i][j] = 1;
            }
            if (mapData[i][j] === 7) {
                enemyLocation.push({ x: j, y: i, h: Math.PI });
                mapData[i][j] = 1;
            }
            if (mapData[i][j] === 8) {
                enemyLocation.push({ x: j, y: i, h: Math.PI });
                mapData[i][j] = 1;
            }
            if (mapData[i][j] === 9) {
                enemyLocation.push({ x: j, y: i, h: Math.PI });
                mapData[i][j] = 1;
            }
        }
    }
    return {
        mapData,
        playerLocation,
        enemyLocation,
    } as LevelData;
}
