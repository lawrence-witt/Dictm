import * as types from './types';

import User from '../../../db/models/User';

import { UserSession } from '../../services/StorageService';

export const loadUser = (
    session: types.UserSessionWithContext,
    profile: User
): types.UserLoadedAction => ({
    type: types.USER_LOADED,
    payload: {
        session,
        profile
    }
});

export const updateUser = (
    profile: User
): types.UserUpdatedAction => ({
    type: types.USER_PROFILE_UPDATED,
    payload: {
        profile
    }
});

export const updateUserSessionContext = (
    context: types.UserSessionWithContext["context"]
): types.UserSessionContextUpdatedAction => ({
    type: types.USER_SESSION_CONTEXT_UPDATED,
    payload: {
        context
    }
});

export const updateUserSessionFlags = (
    session: UserSession
): types.UserSessionFlagsUpdatedAction => ({
    type: types.USER_SESSION_FLAGS_UPDATED,
    payload: {
        session
    }
});

export const clearUser = (): types.UserClearedAction => ({
    type: types.USER_CLEARED
});