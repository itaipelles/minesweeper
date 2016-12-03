import { expect } from 'chai';
import { reducer, defaultState } from '../../app/reducers/xRay';

describe('x-ray reducer', () => {
    it('should return default state if state is undefined', () => {
        expect(reducer(undefined, {type: "UNKNOWN"})).to.equal(defaultState);
    });

    it('should return action value', () => {
        expect(reducer(false, {type: "UPDATE_X_RAY", value: true})).to.be.true;
        expect(reducer(true, {type: "UPDATE_X_RAY", value: false})).to.be.false;
        expect(reducer(false, {type: "UPDATE_X_RAY", value: false})).to.be.false;
    });

    it('should ignore unknown action types', () => {
        expect(reducer(true, {type: "UNKNOWN", value: false})).to.be.true;
        expect(reducer(false, {type: "UNKNOWN"})).to.be.false;
    });
});
