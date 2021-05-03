import User from '../../../db/models/User';

// Init Application Types

export type AppTransitions = 
|   'authenticate' 
|   'greet'
|   'load'
|   'unload'
|   undefined;

export const APP_INITIALISED            = "dictm/auth/app/INITIALISED";
export const APP_TRANSITION_SET         = "dictm/auth/app/TRANSITION_SET"

export interface InitialAppState {
    isInitialised: boolean;
    transition: AppTransitions;
}

export interface AppInitalisedAction {
    type: typeof APP_INITIALISED;
    payload: {
        transition: AppTransitions;
    }
}

export interface AppTransitionSetAction {
    type: typeof APP_TRANSITION_SET;
    payload: {
        transition: AppTransitions;
    }
}

export type InitialAppActions = 
|   AppInitalisedAction
|   AppTransitionSetAction;

// Local Users Types

export const LOCAL_USERS_LOADED         = "dictm/auth/users/local/LOADED";
export const LOCAL_USER_SELECTED        = "dictm/auth/users/local/SELECTED";
export const LOCAL_USER_UNSELECTED      = "dictm/auth/users/local/UNSELECTED";
export const LOCAL_USERS_CLEARED        = "dictm/auth/users/local/CLEARED";

export interface LocalUsersState {
    isLoaded: boolean;
    selectedId: string | undefined;
    byId: Record<string, User>;
    allIds: string[];
}

export interface LocalUsersLoadedAction {
    type: typeof LOCAL_USERS_LOADED;
    payload: {
        users: User[];
    }
}

export interface LocalUserSelectedAction {
    type: typeof LOCAL_USER_SELECTED;
    payload: {
        id: string;
    }
}

export interface LocalUserUnselectedAction {
    type: typeof LOCAL_USER_UNSELECTED;
}

export interface LocalUsersClearedAction {
    type: typeof LOCAL_USERS_CLEARED;
}

export type LocalUsersActions =
|   LocalUsersLoadedAction
|   LocalUserSelectedAction
|   LocalUserUnselectedAction
|   LocalUsersClearedAction;

// New User Types

export const NEW_USER_UPDATED       = "dictm/auth/users/new/UPDATED";
export const NEW_USER_CLEARED       = "dictm/auth/users/new/CLEARED";

export interface NewUserState {
    name: string;
    greeting: string;
}

export interface NewUserUpdatedAction {
    type: typeof NEW_USER_UPDATED;
    payload: {
        key: keyof NewUserState;
        value: string;
    }
}

export interface NewUserClearedAction {
    type: typeof NEW_USER_CLEARED;
}

export type NewUserActions =
|   NewUserUpdatedAction
|   NewUserClearedAction;