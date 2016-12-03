export const newGame = (width, height, mines) => ({
    type: 'NEW_GAME',
    width,
    height,
    mines
});

export const revealCell = (x, y) => ({
    type: 'REVEAL_CELL',
    x,
    y
});

export const toggleCellFlag = (x, y) => ({
    type: 'TOGGLE_CELL_FLAG',
    x,
    y
});

export const updateXRayVision = (value) => ({
    type: 'UPDATE_X_RAY',
    value
});

export const updateGameConfig = (update) => ({
    type: 'UPDATE_GAME_CONFIG',
    update
});

