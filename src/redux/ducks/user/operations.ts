import { ThunkResult } from '../../store';

import User from '../../../db/models/User';
import UserController from '../../../db/controllers/User';

import StorageService from '../../services/StorageService';

import * as actions from './actions';

import { recordingOperations } from '../content/recordings';
import { noteOperations } from '../content/notes';
import { categoryOperations } from '../content/categories';
import { notificationsOperations } from '../notifications';

const { notifyDatabaseError } = notificationsOperations;

/** 
*  Summary:
*  Load a user and their data into the application
*/

export const loadUser = (
    profile: User
): ThunkResult<Promise<void>> => async (
    dispatch
) => {
    const userData = await (async () => {
        try {
            return await UserController.selectUserData(profile.id);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!userData) return;

    dispatch(recordingOperations.loadRecordings(userData.recordings));
    dispatch(noteOperations.loadNotes(userData.notes));
    dispatch(categoryOperations.loadCategories(userData.categories));
    dispatch(actions.loadUser(profile));

    StorageService.persistSession(profile.id);
}

/** 
*  Summary:
*  Clear a user and their data from the store
*/

export const clearUser = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(recordingOperations.clearRecordings());
    dispatch(noteOperations.clearNotes());
    dispatch(categoryOperations.clearCategories());
    dispatch(actions.clearUser());

    StorageService.clearSession();
}