import * as types from './types';

import User from '../../../db/models/User';

// Init App Actions

export const initialiseApp = (): types.AppInitalisedAction => ({
    type: types.APP_INITIALISED
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

export const clearNewUser = (): types.NewUserClearedAction => ({
    type: types.NEW_USER_CLEARED
});