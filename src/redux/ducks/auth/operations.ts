import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../store';

import * as types from './types';
import * as actions from './actions';

/* 
*   Auth Panel Operations
*/

/** 
*  Summary:
*  Move the auth panel state one view back
*/

export const popAuthPanel = (): PopAuthPanelThunkAction => (
    dispatch
): void => {
    dispatch(actions.popAuthPanel());
}

type PopAuthPanelThunkAction = ThunkAction<void, undefined, unknown, types.AuthPanelPoppedAction>;

/** 
*  Summary:
*  Move the auth panel state to a new view
*/

export const pushAuthPanel = (
    panel: types.PanelTypes
): PushAuthPanelThunkAction => (
    dispatch
): void => {
    dispatch(actions.pushAuthPanel(panel));
}

type PushAuthPanelThunkAction = ThunkAction<void, undefined, unknown, types.AuthPanelPushedAction>;

/* 
*   Local Users Operations
*/

/** 
*  Summary:
*  Load local user profiles from IndexedDB
*/

export const loadLocalUsers = (): LoadLocalUsersThunkAction => (
    dispatch
): void => {
    //
}

type LoadLocalUsersThunkAction = ThunkAction<void, undefined, unknown, types.LocalUsersLoadedAction>;

/** 
*  Summary:
*  Select a local user profile
*/

export const selectLocalUser = (
    id: string
): SelectLocalUserThunkAction => (
    dispatch
): void => {
    dispatch(actions.selectLocalUser(id))
}

type SelectLocalUserThunkAction = ThunkAction<void, undefined, unknown, types.LocalUserSelectedAction>;

/** 
*  Summary:
*  Unselect a local user profile
*/

export const unselectLocalUser = (): UnselectLocalUserThunkAction => (
    dispatch
): void => {
    dispatch(actions.unselectLocalUser());
}

type UnselectLocalUserThunkAction = ThunkAction<void, undefined, unknown, types.LocalUserUnselectedAction>;

/** 
*  Summary:
*  Load the selected user into the application
*/

export const loadSelectedUser = (): LoadSelectedUserThunkAction => (
    dispatch,
    getState
): void => {
    //
}

type LoadSelectedUserThunkAction = ThunkAction<void, RootState, unknown, any>;

/** 
*  Summary:
*  Clear the local users information from Redux store
*/

export const clearLocalUsers = (): ClearLocalUsersThunkAction => (
    dispatch
): void => {
    dispatch(actions.clearLocalUsers());
}

type ClearLocalUsersThunkAction = ThunkAction<void, undefined, unknown, types.LocalUsersClearedAction>;

/* 
*   New User Operations 
*/

/** 
*  Summary:
*  Reset the new user state with fresh fields
*/

export const startNewUser = (): StartNewUserThunkAction => (
    dispatch
): void => {
    dispatch(actions.startNewUser());
}

type StartNewUserThunkAction = ThunkAction<void, undefined, unknown, types.NewUserStartedAction>;

/** 
*  Summary:
*  Update a field on the new user state
*/

export const updateNewUser = (
    key: keyof types.NewUserState,
    value: string
): UpdateNewUserThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNewUser(key, value));
}

type UpdateNewUserThunkAction = ThunkAction<void, undefined, unknown, types.NewUserUpdatedAction>;

/** 
*  Summary:
*  Create a new user with the provided fields
*/

export const createNewUser = (): CreateNewUserThunkAction => (
    dispatch,
    getState
): void => {
    //
}

type CreateNewUserThunkAction = ThunkAction<void, RootState, unknown, any>;