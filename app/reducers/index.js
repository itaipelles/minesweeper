import { combineReducers } from 'redux';
import game from './gameLogic';
import gameConfig from './gameConfig';
import xRay from './xRay';

const minesweeperApp = combineReducers({
    game,
    gameConfig,
    xRay
});

export default minesweeperApp;