import User from '../../../db/models/User';

export const USER_LOADED    = "dictm/user/LOADED";
export const USER_CLEARED   = "dictm/user/CLEARED"

export interface UserState {
    isLoaded: boolean;
    profile: User;
}

export interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: {
        profile: User;
    }
}

export interface UserClearedAction {
    type: typeof USER_CLEARED;
}

export type UserActionTypes = 
|   UserLoadedAction
|   UserClearedAction;

export interface UserSession {
    user: {
        id: string;
    };
    timestamps: {
        created: number;
        modified: number;
    }
}