import { combineReducers } from 'redux';

import * as types from './types';

// Init App Reducer

const initialAppState: types.InitialAppState = {
    isInitialised: false,
    transition: undefined
}

const initialAppReducer = (
    state = initialAppState,
    actions: types.InitialAppActions
): types.InitialAppState => {
    switch(actions.type) {
        case types.APP_INITIALISED:
            return {
                isInitialised: true,
                transition: actions.payload.transition
            }
        case types.APP_TRANSITION_SET:
            return {
                ...state,
                transition: actions.payload.transition
            }
        default:
            return state;
    }
}

// Local Users Reducer

const initialLocalUsersState: types.LocalUsersState = {
    isLoaded: false,
    selectedId: undefined,
    byId: {},
    allIds: []
}

const localUsersReducer = (
    state = initialLocalUsersState,
    actions: types.LocalUsersActions
): types.LocalUsersState => {
    switch(actions.type) {
        case types.LOCAL_USERS_LOADED:
            const clonedState = {
                ...state,
                byId: {...state.byId},
                allIds: [...state.allIds]
            }

            return actions.payload.users.reduce((out: types.LocalUsersState, user) => {
                out.byId[user.id] = user;
                out.allIds = [...out.allIds, user.id];
                return out;
            }, { ...clonedState, isLoaded: true });
        case types.LOCAL_USER_SELECTED:
            return {
                ...state,
                selectedId: actions.payload.id
            }
        case types.LOCAL_USER_UNSELECTED:
            return {
                ...state,
                selectedId: undefined
            }
        case types.LOCAL_USERS_CLEARED:
            return initialLocalUsersState;
        default:
            return state;
    }
}

// New User Reducer

const initialNewUserState: types.NewUserState = {
    name: "",
    greeting: ""
}

const newUserReducer = (
    state = initialNewUserState,
    action: types.NewUserActions
): types.NewUserState => {
    switch (action.type) {
        case types.NEW_USER_UPDATED:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        case types.NEW_USER_CLEARED:
            return initialNewUserState;
        default:
            return state;
    }
}

const reducer = combineReducers({
    app: initialAppReducer,
    local: localUsersReducer,
    new: newUserReducer
});

export default reducer;