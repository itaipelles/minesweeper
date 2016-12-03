import { expect } from 'chai';
import { reducer, defaultState } from '../../app/reducers/gameLogic';
import { MAX_TABLE_DIMENSION_SIZE,
         MIN_TABLE_DIMENSION_SIZE,
         MIN_MINES_NUMBER } from "../../app/config";

describe('game reducer', () => {
    it('should return default state if state is undefined', () => {
        expect(reducer(undefined, {type: "UNKNOWN"})).to.eql(defaultState);
    });

    it('should ignore unknown action types', () => {
        expect(reducer(defaultState, {type: "UNKNOWN", x: 1, y: 1})).to.eql(defaultState);
        expect(reducer(defaultState, {type: "UNKNOWN"})).to.eql(defaultState);
    });

    describe('new game action', () => {
       const newGameAction = {type: "NEW_GAME", width: 7, height: 8, mines: 9};

       it('should set won and lost to false', () => {
           const state = reducer(undefined, newGameAction);
           expect(state).to.have.property("won", false);
           expect(state).to.have.property("lost", false);
       });

        it('should set flags left to number of mines', () => {
            const state = reducer(undefined, newGameAction);
            expect(state).to.have.property("flagsLeft", 9);
        });

       it('should initialize a board with the correct dimensions', () => {
           const board = reducer(undefined, newGameAction).board;
           expect(board).to.have.lengthOf(8);
           expect(board[0]).to.have.lengthOf(7);
       });

        it('should place the correct number of mines', () => {
            const board = reducer(undefined, newGameAction).board;
            expect(countAllMines(board)).to.equal(9);
        });

        it('should correctly set the "adjacent mines" counter of all the cells', () => {
            const board = reducer(undefined, newGameAction).board;
            expect(board.every((row, x) =>
                row.every((cell, y) =>
                cell.adjacentMines === countAdjacentMines(board, x, y)))).to.be.true;
        });

       it('should throw error on bad width input', () => {
           let badNewGameAction = {...newGameAction};

           badNewGameAction.width = MIN_TABLE_DIMENSION_SIZE - 1;
           expect(reducer.bind(undefined, [undefined, badNewGameAction])).to.throw(Error);
           badNewGameAction.width = MAX_TABLE_DIMENSION_SIZE + 1;
           expect(reducer.bind(undefined, [undefined, badNewGameAction])).to.throw(Error);
       });

        it('should throw error on bad height input', () => {
            let badNewGameAction = {...newGameAction};

            badNewGameAction.height = MIN_TABLE_DIMENSION_SIZE - 1;
            expect(reducer.bind(undefined, [undefined, badNewGameAction])).to.throw(Error);
            badNewGameAction.height = MAX_TABLE_DIMENSION_SIZE + 1;
            expect(reducer.bind(undefined, [undefined, badNewGameAction])).to.throw(Error);
        });

        it('should throw error on bad mines input', () => {
            let badNewGameAction = {...newGameAction};

            badNewGameAction.mines = MIN_MINES_NUMBER - 1;
            expect(reducer.bind(undefined, [undefined, badNewGameAction])).to.throw(Error);
            badNewGameAction.mines = newGameAction.width * newGameAction.height;
            expect(reducer.bind(undefined, [undefined, badNewGameAction])).to.throw(Error);
        });
    });

    describe('reveal cell action', () => {
        let state, action;

        beforeEach(() => {
            action = {type: "REVEAL_CELL", x: 1, y: 1};
            let board = parseBoard([['*', '1', ' '],
                                    ['1', '1', ' ']]);
            state = {board, won: false, lost: false, flagsLeft: 1};
        });

        it('should reveal single numbered cell', () => {
           const newState = reducer(state, action);
           state.board[1][1].revealed = true;
           expect(newState).to.eql(state);
        });

        it('should reveal an empty cell, all adjacent empty cells and their adjacent cells', () => {
            action.y = 2;
            const newState = reducer(state, action);
            state.board[0][2].revealed = true;
            state.board[1][2].revealed = true;
            state.board[0][1].revealed = true;
            state.board[1][1].revealed = true;
            expect(newState).to.eql(state);
        });

        it('should reveal a mine and lose game', () => {
            action.y = 0;
            const newState = reducer(state, action);
            state.board[0][0].revealed = true;
            state.lost = true;
            expect(newState).to.eql(state);
        });

        it('should not reveal a flagged cell', () => {
            state.board[1][1].flagged = true;
            const newState = reducer(state, action);
            expect(newState).to.eql(state);
        });

        it('should not reveal a cell if won or lost', () => {
            state.won = true;
            let newState = reducer(state, action);
            expect(newState).to.eql(state);

            state.won = false;
            state.lost = true;
            newState = reducer(state, action);
            expect(newState).to.eql(state);
        });
    });

    describe('toggle cell flag action', () => {
        let state, action;

        beforeEach(() => {
            action = {type: "TOGGLE_CELL_FLAG", x: 1, y: 1};
            let board = parseBoard([['*', '1', ' '],
                                    ['1', '1', ' ']]);
            state = {board, won: false, lost: false, flagsLeft: 2};
        });

        it('should flag an unflagged cell and decrement flags left', () => {
            const newState = reducer(state, action);
            state.board[1][1].flagged = true;
            state.flagsLeft--;
            expect(newState).to.eql(state);
        });

        it('should unflag a flagged cell and increment flags left', () => {
            state.board[1][1].flagged = true;
            const newState = reducer(state, action);
            state.board[1][1].flagged = false;
            state.flagsLeft++;
            expect(newState).to.eql(state);
        });

        it('should not flag if no flags left', () => {
            state.flagsLeft = 0;
            const newState = reducer(state, action);
            expect(newState).to.eql(state);
        });

        it('should not flag a revealed cell', () => {
            state.board[1][1].revealed = true;
            const newState = reducer(state, action);
            expect(newState).to.eql(state);
        });

        it('should flag last mine and win the game', () => {
            action.x = 0;
            action.y = 0;
            const newState = reducer(state, action);
            state.flagsLeft--;
            state.board[0][0].flagged = true;
            state.won = true;
            expect(newState).to.eql(state);
        });

        it('should not flag a cell if won or lost', () => {
            state.won = true;
            let newState = reducer(state, action);
            expect(newState).to.eql(state);

            state.won = false;
            state.lost = true;
            newState = reducer(state, action);
            expect(newState).to.eql(state);
        });
    });
});

const countAllMines = board =>
    board.reduce((sum, row) => sum + row.reduce((sum2, cell) => sum2 + cell.isMine, 0), 0);

const countAdjacentMines = (board, x, y) =>
    directions.reduce((count, {dx, dy}) =>
        count + (validateXY(board, x + dx, y + dy) && board[x + dx][y + dy].isMine), 0);

const validateXY = (board, x, y) => x >= 0 && y >= 0 && x < board.length && y < board[0].length;

const parseBoard = board => board.map(row => row.map(char => ({
    isMine: char === '*',
    adjacentMines: char === '*' || char === ' ' ? 0 : +char,
    revealed: true,
    flagged: true
})));

const directions = [{dx: -1, dy: -1}, {dx: -1, dy: 0}, {dx: -1, dy: 1},
    {dx: 0, dy: -1}, {dx: 0, dy: 1},
    {dx: 1, dy: -1}, {dx: 1, dy: 0}, {dx: 1, dy: 1}];
