import * as types from './types';

const initialState: types.UserState = {
    session: undefined,
    profile: undefined
};

const userReducer = (
    state = initialState, 
    action: types.UserActionTypes
): types.UserState => {
    switch(action.type) {
        case types.USER_LOADED:
            return {
                session: action.payload.session,
                profile: action.payload.profile
            }
        case types.USER_PROFILE_UPDATED:
            return {
                ...state,
                profile: action.payload.profile
            }
        case types.USER_SESSION_CONTEXT_UPDATED: {
            if (!state.session) return state;
            return {
                ...state,
                session: {
                    ...state.session,
                    context: action.payload.context
                }
            }
        }
        case types.USER_SESSION_FLAGS_UPDATED:
            if (!state.session) return state;
            return {
                ...state,
                session: {
                    ...state.session,
                    ...action.payload.session
                }
            }
        case types.USER_CLEARED:
            return initialState;
        default:
            return state;
    }
}

export default userReducer;