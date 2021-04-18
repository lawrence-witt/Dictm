import * as types from './types';

import User from '../../../db/models/User';

export const loadUser = (
    profile: User
): types.UserLoadedAction => ({
    type: types.USER_LOADED,
    payload: {
        profile
    }
});

export const clearUser = (): types.UserClearedAction => ({
    type: types.USER_CLEARED
});