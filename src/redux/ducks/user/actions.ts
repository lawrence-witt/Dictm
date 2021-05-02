import * as types from './types';

import User from '../../../db/models/User';

export const loadUser = (
    user: User
): types.UserLoadedAction => ({
    type: types.USER_LOADED,
    payload: {
        user
    }
});

export const updateUser = (
    user: User
): types.UserUpdatedAction => ({
    type: types.USER_UPDATED,
    payload: {
        user
    }
});

export const clearUser = (): types.UserClearedAction => ({
    type: types.USER_CLEARED
});