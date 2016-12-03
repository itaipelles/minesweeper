import { MAX_TABLE_DIMENSION_SIZE,
         MIN_TABLE_DIMENSION_SIZE,
         MIN_MINES_NUMBER } from '../config';

export const reducer = (state = {...defaultState}, action) => {
    switch (action.type) {
        case 'NEW_GAME':
            //This reduction is not pure, as it has to generate a different board each execution (randomly)
            //Perhaps it might be better to move this non pure code to the action creator,
            //But that would cause the logic to spread across the app instead of being all concentrated here
            return {...defaultState,
                board: initNewGameBoard(action.width, action.height, action.mines),
                flagsLeft: action.mines };
        case 'REVEAL_CELL':
            return revealCell(state, action.x, action.y);
        case 'TOGGLE_CELL_FLAG':
            return toggleCellFlag(state, action.x, action.y);
        default:
            return state;
    }
};

export const defaultState = {
    board: [],
    flagsLeft: 0,
    won: false,
    lost: false
};

const revealCell = (state, x, y) => {
    let { board } = state;
    const cell = board[x][y];
    let lost = false;

    if(isGameOver(state) || isUnrevealable(cell))
        return state;

    if(isEmpty(cell)) {
        const cellsToReveal = getCellsToRevealRecursive(board, x, y);
        board = setPropertyOnCellsArray(board, cellsToReveal, {revealed: true});
        return {...state, board};
    }

    if(cell.isMine) {
        lost = true;
    }

    board = setPropertyOnCell(board, x, y, {revealed: true});
    return {...state, board, lost};
};

const toggleCellFlag = (state, x, y) => {
    let { board, flagsLeft } = state;
    const cell = board[x][y];
    let won = false;

    if(isGameOver(state) || isUnflaggable(cell))
        return state;

    if(isFlaggingButHasNoFlagsLeft(flagsLeft, cell.flagged))
        return state;

    board = setPropertyOnCell(board, x, y, {flagged: !cell.flagged});

    if(cell.flagged) {
        //unflagging
        flagsLeft++;
    } else {
        //flagging
        flagsLeft--;
        won = checkIfWon(board, flagsLeft);
    }

    return {...state, board, flagsLeft, won};
};

const isUnrevealable = ({ flagged, revealed }) => flagged || revealed;

const isUnflaggable = ({ revealed }) => revealed;

const isFlaggingButHasNoFlagsLeft = (flagsLeft, flagged) => flagsLeft <= 0 && !flagged;

const isGameOver = ({ won, lost }) => won || lost;

const setPropertyOnCell = (board, x, y, prop) => {
    return board.map((row, loopX) => {
        return loopX === x ?
            row.map((cell, loopY) => {
                if (loopX === x && loopY === y)
                    return {...cell, ...prop};
                return cell;
            }) : row;
    });
};

const setPropertyOnCellsArray = (board, cells, prop) => {
    return board.map((row, loopX) => {
        return row.map((cell, loopY) => {
            if (cells.find(({ x, y }) => x === loopX && y === loopY))
                return {...cell, ...prop};
            return cell;
        });
    });
};

const getCellsToRevealRecursive = (board, x, y, visited = []) => {
    if(visited[`${x},${y}`])
        return [];

    visited[`${x},${y}`] = true;

    if(!validateXYAreInRange(board, x, y))
        return [];

    const cell = board[x][y];

    if(isUnrevealable(cell))
        return [];

    if(!isEmpty(cell))
        return [{x, y}];

    //Recursively get all cells to reveal in all directions, concat all and add self
    return directions.map(({ dx, dy }) => getCellsToRevealRecursive(board, x + dx, y + dy, visited)).
            reduce((total, current) => total.concat(current), []).
            concat({x, y});
};

const isEmpty = ({ isMine, adjacentMines }) => !isMine && adjacentMines === 0;

const checkIfWon = (board, flagsLeft) => {
    return flagsLeft === 0 && board.every(row => row.every(ifMineThanFlagged));
};

const ifMineThanFlagged = ({ isMine, flagged }) => isMine ? flagged : true;

const initNewGameBoard = (width, height, mines) => {
    if(!validateNewGameParams(width, height, mines))
        throw new Error('Invalid board configuration');

    const board = createEmptyBoard(width, height);
    randomlyFillBoardWithBombs(board, width, height, mines);

    return board;
};

const createEmptyBoard = (width, height) => (new Array(height)).fill().map(() => (new Array(width)).fill().map(() => ({...initialCell})));

const randomlyFillBoardWithBombs = (board, width, height, mines) => {
    let minesCounter = 0;

    while (minesCounter < mines) {
        const row = Math.floor(Math.random() * height);
        const column = Math.floor(Math.random() * width);

        if (board[row][column].isMine)
            continue;

        board[row][column].isMine = true;
        incrementAdjacentCellsMinesCounter(board, row, column);
        minesCounter++;
    }
};

const validateXYAreInRange = (board, x, y) => x >= 0 && x < board.length && y >= 0 && y < board[0].length;

const validateNewGameParams = (width, height, mines) => validateTableDimension(width) && validateTableDimension(height) && validateMinesNumber(width, height, mines);

const validateTableDimension = dimension => dimension >= MIN_TABLE_DIMENSION_SIZE && dimension <= MAX_TABLE_DIMENSION_SIZE;

const validateMinesNumber = (width, height, mines) => mines >= MIN_MINES_NUMBER && mines <= width * height - 1;

const initialCell = {
    isMine: false,
    adjacentMines: 0,
    flagged: false,
    revealed: false
};

const incrementAdjacentCellsMinesCounter = (board, x, y) => {
    directions.map(({ dx, dy }) => ({x: x + dx, y: y + dy})).
            filter(({ x, y }) => validateXYAreInRange(board, x, y)).
            forEach(({ x, y }) => board[x][y].adjacentMines++);
};

const directions = [{dx: -1, dy: -1}, {dx: -1, dy: 0}, {dx: -1, dy: 1},
    {dx: 0, dy: -1}, {dx: 0, dy: 1},
    {dx: 1, dy: -1}, {dx: 1, dy: 0}, {dx: 1, dy: 1}];

export default reducer;