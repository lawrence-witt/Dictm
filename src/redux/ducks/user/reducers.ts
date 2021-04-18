import * as types from './types';

const initialState: types.UserState = {
    isLoaded: false,
    profile: {
        id: "",
        type: "user",
        attributes: {
            name: "",
            timestamps: {
                created: 0,
                modified: 0
            }
        },
        preferences: {
            greeting: ""
        }
    }
}

const userReducer = (
    state = initialState, 
    action: types.UserActionTypes
): types.UserState => {
    switch(action.type) {
        case types.USER_LOADED:
            return {
                isLoaded: true,
                profile: action.payload.profile
            }
        case types.USER_CLEARED:
            return initialState;
        default:
            return state;
    }
}

export default userReducer;