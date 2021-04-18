import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../store';

import { UserController } from '../../../db/controllers/User';

import * as types from './types';
import * as actions from './actions';

import { userOperations } from '../user';

/* 
*   Local Users Operations
*/

/** 
*  Summary:
*  Load local user profiles from IndexedDB
*/

export const loadLocalUsers = (): LoadLocalUsersThunkAction => async (
    dispatch
): Promise<void> => {
    const users = await (async () => {
        try {
            return await UserController.selectLocalUsers();
        } catch (err) {
            // handle bad db connection
            console.log(err);
        }
    })();

    if (!users) return;

    dispatch(actions.loadLocalUsers(users));
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
*  Initialise application load with the selected user
*/

export const loadSelectedUser = (): LoadSelectedUserThunkAction => (
    dispatch,
    getState
): void => {
    const { selectedId, byId } = getState().auth.local;

    if (!selectedId) return;

    const user = byId[selectedId];

    dispatch(userOperations.loadUser(user));
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
*  Create a new user and initialise application load
*/

export const createNewUser = (): CreateNewUserThunkAction => async (
    dispatch,
    getState
): Promise<void> => {
    const { name, greeting } = getState().auth.new;

    if (!name || name.length === 0) return;

    const user = await (async () => {
        try {
            return await UserController.insertUser(name, greeting);
        } catch (err) {
            // handle no creation
            console.log(err);
            return;
        }
    })();

    if (!user) return;

    dispatch(userOperations.loadUser(user));
}

type CreateNewUserThunkAction = ThunkAction<void, RootState, unknown, any>;