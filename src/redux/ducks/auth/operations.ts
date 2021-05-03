import { ThunkResult } from '../../store';

import User from '../../../db/models/User';
import UserController from '../../../db/controllers/User';

import StorageService from '../../services/StorageService';

import * as types from './types';
import * as actions from './actions';

import { userOperations } from '../user';
import { notificationsOperations } from '../notifications';

const { notifyDatabaseError, notifyGenericError } = notificationsOperations;

/* 
*   Initial App Operations
*/

export const initialiseApp = (): ThunkResult<Promise<void>> => async (
    dispatch
) => {
    const session = StorageService.retrieveSession();

    const lastly = () => dispatch(actions.initialiseApp());

    if (session) {
        const { user: { id: userId }, flags } = session;

        if (flags.hasError) {
            try {
                await UserController.repairUserData(userId);
                StorageService.setSessionFlag("hasError", false);
            } catch (err) {
                StorageService.clearSession();
                dispatch(notifyGenericError([`User data could not be repaired: ${err.message}.`]));
                lastly();
                return;
            }
        }

        try {
            const user = await UserController.selectUser(userId);
            dispatch(userOperations.loadUser(user)).then(lastly);
            return;
        } catch {
            StorageService.clearSession();
        }
    }

    lastly();
}

export const setAppTransition = (
    transition: types.AppTransitions
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    dispatch(actions.setAppTransition(transition));
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
            return await UserController.selectUsers();
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
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

    dispatch(setAppTransition("authenticate"));
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
*   Summary:
*   Clear the new user information from store
*/

export const clearNewUser = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.clearNewUser());
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

    const newUser = new User(name, greeting);

    const insertedUser = await (async () => {
        try {
            return await UserController.insertUser(newUser);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!insertedUser) return;

    dispatch(setAppTransition("authenticate"));
    dispatch(userOperations.loadUser(insertedUser));
}