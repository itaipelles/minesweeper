import { expect } from 'chai';
import * as actions from '../../app/actions/index';

describe('actions', () => {
    describe('newGame', () => {
        it('should return the correct action object', () => {
            let width = 1, height = 2, mines = 3, type = "NEW_GAME";
            expect(actions.newGame(width, height, mines)).to.eql({ width, height, mines, type });
        });
    });

    describe('revealCell', () => {
        it('should return the correct action object', () => {
            let x = 1, y = 2, type = "REVEAL_CELL";
            expect(actions.revealCell(x, y)).to.eql({ x, y, type });
        });
    });

    describe('toggleCellFlag', () => {
        it('should return the correct action object', () => {
            let x = 1, y = 2, type = "TOGGLE_CELL_FLAG";
            expect(actions.toggleCellFlag(x, y)).to.eql({ x, y, type });
        });
    });

    describe('updateXRayVision', () => {
        it('should return the correct action object', () => {
            let value = true, type = "UPDATE_X_RAY";
            expect(actions.updateXRayVision(value)).to.eql({ value, type });
        });
    });

    describe('updateGameConfig', () => {
        it('should return the correct action object', () => {
            let update = {a: 'b'}, type = "UPDATE_GAME_CONFIG";
            expect(actions.updateGameConfig(update)).to.eql({ update, type });
        });
    });
});