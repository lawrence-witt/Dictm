import User from '../../../db/models/User';

import { UserSession } from '../../services/StorageService';

export const USER_LOADED                    = "dictm/user/LOADED";
export const USER_PROFILE_UPDATED           = "dictm/user/PROFILE_UPDATED";
export const USER_SESSION_CONTEXT_UPDATED   = "dictm/user/SESSION_CONTEXT_UPDATED";
export const USER_SESSION_FLAGS_UPDATED     = "dictm/user/SESSION_UPDATED";
export const USER_CLEARED                   = "dictm/user/CLEARED";

export interface UserSessionWithContext extends UserSession {
    context: "returning" | "new" | undefined;
}

export type UserState = {
    session: UserSessionWithContext | undefined;
    profile: User | undefined;
}

export interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: {
        session: UserSessionWithContext;
        profile: User;
    }
}

export interface UserUpdatedAction {
    type: typeof USER_PROFILE_UPDATED;
    payload: {
        profile: User;
    }
}

export interface UserSessionContextUpdatedAction {
    type: typeof USER_SESSION_CONTEXT_UPDATED;
    payload: {
        context: UserSessionWithContext["context"];
    }
}

export interface UserSessionFlagsUpdatedAction {
    type: typeof USER_SESSION_FLAGS_UPDATED;
    payload: {
        session: UserSession;
    }
}

export interface UserClearedAction {
    type: typeof USER_CLEARED;
}

export type UserActionTypes = 
|   UserLoadedAction
|   UserUpdatedAction
|   UserSessionContextUpdatedAction
|   UserSessionFlagsUpdatedAction
|   UserClearedAction;