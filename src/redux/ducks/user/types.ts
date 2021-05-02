import User from '../../../db/models/User';

export const USER_LOADED    = "dictm/user/LOADED";
export const USER_UPDATED   = "dictm/user/UPDATED";
export const USER_CLEARED   = "dictm/user/CLEARED";

export type UserState = {
    profile: User | undefined;
}

export interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: {
        user: User;
    }
}

export interface UserUpdatedAction {
    type: typeof USER_UPDATED;
    payload: {
        user: User;
    }
}

export interface UserClearedAction {
    type: typeof USER_CLEARED;
}

export type UserActionTypes = 
|   UserLoadedAction
|   UserUpdatedAction
|   UserClearedAction;