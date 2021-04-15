import { combineReducers } from 'redux';

import * as types from './types';

// Auth Panel Reducer

const initialPanelState: types.AuthPanelState = {
    prev: undefined,
    current: "home"
}

const panelReducer = (
    state = initialPanelState,
    action: types.AuthPanelActions
): types.AuthPanelState => {
    switch(action.type) {
        case types.AUTH_PANEL_POPPED:
            if (!state.prev) return state;
            return {
                prev: state.current,
                current: state.prev
            }
        case types.AUTH_PANEL_PUSHED:
            return {
                prev: state.current,
                current: action.payload.panel
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
            return actions.payload.users.reduce((out: types.LocalUsersState, user) => {
                out.byId[user.id] = user;
                out.allIds = [...out.allIds, user.id];
                return out;
            }, { ...initialLocalUsersState, isLoaded: true });
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
        case types.NEW_USER_STARTED:
            return initialNewUserState;
        case types.NEW_USER_UPDATED:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        default:
            return state;
    }
}

const reducer = combineReducers({
    panel: panelReducer,
    local: localUsersReducer,
    new: newUserReducer
});

export default reducer;