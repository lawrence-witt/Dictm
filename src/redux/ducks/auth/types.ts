import User from '../../../db/models/User';

// Auth Panel Types

export const AUTH_PANEL_PUSHED = "dictm/auth/panel/PUSHED";
export const AUTH_PANEL_POPPED = "dictm/auth/panel/POPPED";

export type PanelTypes = "home" | "local" | "new";

export interface AuthPanelState {
    prev?: PanelTypes;
    current: PanelTypes;
}

export interface AuthPanelPushedAction {
    type: typeof AUTH_PANEL_PUSHED;
    payload: {
        panel: PanelTypes;
    }
}

export interface AuthPanelPoppedAction {
    type: typeof AUTH_PANEL_POPPED;
}

export type AuthPanelActions =
|   AuthPanelPushedAction
|   AuthPanelPoppedAction;

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

export const NEW_USER_STARTED       = "dictm/auth/users/new/STARTED";
export const NEW_USER_UPDATED       = "dictm/auth/users/new/UPDATED";

export interface NewUserState {
    name: string;
    greeting: string;
}

export interface NewUserStartedAction {
    type: typeof NEW_USER_STARTED;
}

export interface NewUserUpdatedAction {
    type: typeof NEW_USER_UPDATED;
    payload: {
        key: keyof NewUserState;
        value: string;
    }
}

export type NewUserActions =
|   NewUserStartedAction
|   NewUserUpdatedAction;