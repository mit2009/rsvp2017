export interface ILevelMap {
    [level: number]: number[];
}

// Tile Definitions
// --------------------
// 0: nothing
// 1: floor
// 2: short wall
// 3: tall wall

// levels are formatted so they're easy to edit with a software called
// TILED the free tile editing software

// level software can be found here: https://thorbjorn.itch.io/tiled?download

export const gridWidth = 16;
export const gridHeight = 16;

export const levelMap: ILevelMap = {
    1:
        // tslint:disable-next-line: prettier
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 3, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
