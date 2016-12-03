export const defaultState = false;

export const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_X_RAY':
            return action.value;
        default:
            return state;
    }
};

export default reducer;