import { expect } from 'chai';
import { reducer, defaultState } from '../../app/reducers/gameConfig';

describe('game config reducer', () => {
    it('should return default state if state is undefined', () => {
        expect(reducer(undefined, {type: "UNKNOWN"})).to.eql(defaultState);
    });

    it('should update state according to action', () => {
        expect(reducer(defaultState, {type: "UPDATE_GAME_CONFIG", update: {width: 1}})).
                to.eql({...defaultState, width: 1});
        expect(reducer(defaultState, {type: "UPDATE_GAME_CONFIG", update: {height: 2}})).
                to.eql({...defaultState, height: 2});
        expect(reducer(defaultState, {type: "UPDATE_GAME_CONFIG", update: {mines: 3}})).
                to.eql({...defaultState, mines: 3});
    });

    it('should ignore unknown action types', () => {
        expect(reducer(defaultState, {type: "UNKNOWN", update: {width: 5}})).to.eql(defaultState);
        expect(reducer(defaultState, {type: "UNKNOWN"})).to.eql(defaultState);
    });
});
