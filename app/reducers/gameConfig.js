export const defaultState = {width: 10, height: 10, mines: 10};

export const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_GAME_CONFIG':
            return {...state, ...action.update};
        default:
            return state;
    }
};

export default reducer;