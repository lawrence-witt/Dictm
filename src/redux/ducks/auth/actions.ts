import * as types from './types';

import User from '../../../db/models/User';

// Auth Panel Actions

export const popAuthPanel = (): types.AuthPanelPoppedAction => ({
    type: types.AUTH_PANEL_POPPED
});

export const pushAuthPanel = (
    panel: types.PanelTypes
): types.AuthPanelPushedAction => ({
    type: types.AUTH_PANEL_PUSHED,
    payload: {
        panel
    }
});

// Local Users Actions

export const loadLocalUsers = (
    users: User[]
): types.LocalUsersLoadedAction => ({
    type: types.LOCAL_USERS_LOADED,
    payload: {
        users
    }
});

export const selectLocalUser = (
    id: string
): types.LocalUserSelectedAction => ({
    type: types.LOCAL_USER_SELECTED,
    payload: {
        id
    }
});

export const unselectLocalUser = (): types.LocalUserUnselectedAction => ({
    type: types.LOCAL_USER_UNSELECTED
});

export const clearLocalUsers = (): types.LocalUsersClearedAction => ({
    type: types.LOCAL_USERS_CLEARED
});

// New User Actions

export const startNewUser = (): types.NewUserStartedAction => ({
    type: types.NEW_USER_STARTED
});

export const updateNewUser = (
    key: keyof types.NewUserState,
    value: string
): types.NewUserUpdatedAction => ({
    type: types.NEW_USER_UPDATED,
    payload: {
        key,
        value
    }
});