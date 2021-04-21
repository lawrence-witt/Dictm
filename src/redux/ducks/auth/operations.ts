import { ThunkResult } from '../../store';

import { UserController } from '../../../db/controllers/User';

import * as types from './types';
import * as actions from './actions';

import { userOperations, userHelpers } from '../user';

/* 
*   Init App Operations
*/

export const initialiseApp = (): ThunkResult<Promise<void>> => async (
    dispatch
) => {
    const user = await userHelpers.retrieveSession();

    const lastly = () => dispatch(actions.initialiseApp());

    if (user) {
        dispatch(userOperations.loadUser(user)).then(lastly);
        return;
    }

    lastly();
}

/* 
*   Local Users Operations
*/

/** 
*  Summary:
*  Load local user profiles from IndexedDB
*/

export const loadLocalUsers = (): ThunkResult<Promise<void>> => async (
    dispatch
) => {
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

/** 
*  Summary:
*  Select a local user profile
*/

export const selectLocalUser = (
    id: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.selectLocalUser(id))
}

/** 
*  Summary:
*  Unselect a local user profile
*/

export const unselectLocalUser = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.unselectLocalUser());
}

/** 
*  Summary:
*  Begin loading application with the selected user
*/

export const loadSelectedUser = (): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { selectedId, byId } = getState().auth.local;

    if (!selectedId) return;

    const user = byId[selectedId];

    dispatch(userOperations.loadUser(user));
}

/** 
*  Summary:
*  Clear the local users information from Redux store
*/

export const clearLocalUsers = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.clearLocalUsers());
}

/* 
*   New User Operations 
*/

/** 
*  Summary:
*  Reset the new user state with fresh fields
*/

export const startNewUser = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.startNewUser());
}

/** 
*  Summary:
*  Update a field on the new user state
*/

export const updateNewUser = (
    key: keyof types.NewUserState,
    value: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateNewUser(key, value));
}

/** 
*  Summary:
*  Create a new user and begin loading application
*/

export const createNewUser = (): ThunkResult<Promise<void>> => async (
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