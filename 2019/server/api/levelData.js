"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Tile Definitions
// --------------------
// 0: nothing
// 1: floor
// 2: short wall
// 3: tall wall
// 4: player starting location
// 5: enemy starting location
// levels are formatted so they're easy to edit with a software called
// TILED the free tile editing software
// level software can be found here: https://thorbjorn.itch.io/tiled?download
exports.gridWidth = 16;
exports.gridHeight = 16;
exports.tileWidth = 30;
exports.tileHeight = 30;
exports.widthOffset = 2 * exports.tileWidth;
exports.heightOffset = 2 * exports.tileHeight;
exports.playerWidth = 30;
exports.playerHeight = 30;
exports.bulletWidth = 15;
exports.bulletHeight = 15;
exports.monsterWidth = 30;
exports.monsterHeight = 30;
exports.walls = [3, 4];
exports.voids = [1];
exports.levelMap = {
    1: 
    // tslint:disable-next-line: prettier
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 5, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 3, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 6, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};
// convert to a sensible grid format
function toMatrix(arr, width) {
    return arr.reduce(function (rows, key, index) {
        return (index % width === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
    }, []);
}
function getLevel(level) {
    return toMatrix(exports.levelMap[level], exports.gridWidth);
}
exports.getLevel = getLevel;
function getLevelData(level) {
    var mapData = getLevel(level);
    var playerLocation;
    var enemyLocation = [];
    for (var i = 0; i < exports.gridHeight; i++) {
        for (var j = 0; j < exports.gridWidth; j++) {
            if (mapData[i][j] == 5) {
                playerLocation = { x: j, y: i };
                mapData[i][j] = 1;
            }
            if (mapData[i][j] == 6) {
                enemyLocation.push({ x: j, y: i });
                mapData[i][j] = 1;
            }
        }
    }
    return {
        mapData: mapData, playerLocation: playerLocation, enemyLocation: enemyLocation
    };
}
exports.getLevelData = getLevelData;
//# sourceMappingURL=levelData.js.map