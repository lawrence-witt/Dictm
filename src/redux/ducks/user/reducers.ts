import * as types from './types';

const initialState: types.UserState = {
    profile: undefined
};

const userReducer = (
    state = initialState, 
    action: types.UserActionTypes
): types.UserState => {
    switch(action.type) {
        case types.USER_LOADED:
        case types.USER_UPDATED:
            return {
                profile: action.payload.user
            }
        case types.USER_CLEARED:
            return initialState;
        default:
            return state;
    }
}

export default userReducer;