import { ThunkResult } from '../../store';

import User from '../../../db/models/User';
import UserController from '../../../db/controllers/User';

import StorageService, { UserSession } from '../../services/StorageService';

import * as actions from './actions';
import * as helpers from './helpers';
import * as types from './types';

import { recordingOperations } from '../content/recordings';
import { noteOperations } from '../content/notes';
import { categoryOperations } from '../content/categories';
import { notificationsOperations } from '../notifications';
import { toolOperations } from '../tools';
import { editorOperations } from '../editor';

import { formatFileSize, unformatFileSize } from '../../../lib/utils/formatFileSize';
import storageManagerSupported from '../../../lib/utils/storageManagerSupported';

const { 
    notifyDatabaseError, 
    notifyStorageWarning, 
    notifyPersistence, 
    notifyGenericError 
} = notificationsOperations;

/** 
*  Summary:
*  Load a user and their data into the application
*/

export const loadUser = (
    user: User,
    context: "returning" | "new"
): ThunkResult<Promise<void>> => async (
    dispatch
) => {
    const userData = await (async () => {
        try {
            return await UserController.selectUserData(user.id);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!userData) return;

    const session = StorageService.persistSession(user.id);
    const validatedContext = (() => {
        if (context === "new") return context;
        const oneDay = 24 * 60 * 60 * 1000;
        if (StorageService.sessionOlderThan(oneDay, session)) return "returning";
        return undefined;
    })();
    const sessionWithContext: types.UserSessionWithContext = {
        ...session,
        context: validatedContext
    }

    dispatch(recordingOperations.loadRecordings(userData.recordings));
    dispatch(noteOperations.loadNotes(userData.notes));
    dispatch(categoryOperations.loadCategories(userData.categories));
    dispatch(actions.loadUser(sessionWithContext, user));
}

/** 
*   Summary:
*   Update a user session's context in redux store.
*/

export const updateUserSessionContext = (
    context: types.UserSessionWithContext["context"]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateUserSessionContext(context));
}

/**
*   Summary:
*   Update a user session's flags in localStorage and redux store.
*/

export const updateUserSessionFlags = (
    flag: keyof UserSession["flags"], 
    value: boolean
): ThunkResult<void> => (
    dispatch
) => {
    const session = StorageService.setSessionFlag(flag, value);

    if (!session) return;

    dispatch(actions.updateUserSessionFlags(session))
}

/**
*   Summary:
*   Update a user model in db and redux store.
*/

export const updateUser = (
    user: User
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    const updatedUser = await (async () => {
        try {
            return await UserController.updateUser(user);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!updatedUser) return Promise.reject();

    return dispatch(actions.updateUser(updatedUser));
}

/* 
*   Summary:
*   Update a user's name property
*/

export const updateUserName = (
    name: string
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { profile } = getState().user;

    if (!profile) return;

    const cloned = helpers.cloneUser(profile);
    cloned.attributes.name = name;

    dispatch(updateUser(cloned));
}

/* 
*   Summary:
*   Update a field from user's perference settings
*/

export const updateUserPreference = <
    F extends keyof User["settings"]["preferences"],
    V extends User["settings"]["preferences"][F]
>(
    field: F,
    value: V
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { profile } = getState().user;

    if (!profile) return;

    const cloned = helpers.cloneUser(profile);
    cloned.settings.preferences[field] = value;

    dispatch(updateUser(cloned));
}

/* 
*   Summary:
*   Update a field from user's display sort settings
*/

export const updateUserDisplaySort = <
    F extends keyof User["settings"]["display"]["sort"],
    V extends User["settings"]["display"]["sort"][F]
>(
    field: F,
    value: V
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { profile } = getState().user;

    if (!profile) return;

    const cloned = helpers.cloneUser(profile);
    cloned.settings.display.sort[field] = value;

    dispatch(updateUser(cloned));
}

/** 
*   Summary:
*   Updates a field from the user's persistence settings
*/

export const updateUserStoragePersistence = <
    F extends keyof User["settings"]["storage"]["persistence"],
    V extends User["settings"]["storage"]["persistence"][F]
>(
    field: F,
    value: V
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { profile } = getState().user;

    if (!profile) return;

    const cloned = helpers.cloneUser(profile);
    cloned.settings.storage.persistence[field] = value;

    dispatch(updateUser(cloned));
}

/**
*   Summary:
*   Update a field from user's storage threshold settings
*/

export const updateUserStorageThreshold = <
    F extends keyof User["settings"]["storage"]["threshold"],
    V extends User["settings"]["storage"]["threshold"][F]
>(
    field: F,
    value: V
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { profile } = getState().user;

    if (!profile) return;

    const cloned = helpers.cloneUser(profile);
    cloned.settings.storage.threshold[field] = value;

    dispatch(updateUser(cloned));
}

/** 
*   Summary:
*   Checks persistence and theshold settings after user saves a resource.
*/

export const checkUserStorage = (): ThunkResult<Promise<void>> => async (
    dispatch,
    getState
) => {
    const { profile } = getState().user;

    if (!profile || !storageManagerSupported()) return;

    const { settings: { storage: { persistence, threshold } } } = profile;

    const { prompted } = persistence;

    if (!prompted) {
        const persisted = await navigator.storage.persisted();
        if (!persisted) dispatch(notifyPersistence());

        dispatch(updateUserStoragePersistence("prompted", true));
    }

    const { usage, quota } = await navigator.storage.estimate();
    if (!usage || !quota) return;

    const { value, unit } = threshold;

    const spaceRemaining = quota - usage;
    const byteThreshold = unformatFileSize(value, unit);

    if (spaceRemaining < byteThreshold) {
        dispatch(notifyStorageWarning(formatFileSize(spaceRemaining), `${value} ${unit}`))
    }
}

/** 
*   Summary:
*   Delete a user account and sign out of the application
*/

export const deleteUser = (
    userId: string
): ThunkResult<Promise<void>> => async (
    dispatch
) => {
    try {
        await UserController.deleteUser(userId);
        dispatch(clearUser());
    } catch (err) {
        dispatch(notifyGenericError([err.message]));
    }
}

/** 
*   Summary:
*   Delete user or user data of a particular type
*/

export const deleteUserData = (
    type: "recordings" | "notes" | "categories"
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { recordings, notes, categories } = getState().content;

    switch(type) {
        case "recordings":
            return dispatch(recordingOperations.deleteRecordings(recordings.allIds));
        case "notes":
            return dispatch(noteOperations.deleteNotes(notes.allIds));
        case "categories":
            return dispatch(categoryOperations.deleteCategories(categories.allIds));
    }
}

/** 
*  Summary:
*  Clear a user and their application data from the store
*/

export const clearUser = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.clearUser());
    dispatch(recordingOperations.clearRecordings());
    dispatch(noteOperations.clearNotes());
    dispatch(categoryOperations.clearCategories());
    dispatch(toolOperations.closeTools());
    dispatch(editorOperations.clearEditor());
    dispatch(notificationsOperations.clearNotificiations());

    StorageService.clearSession();
}