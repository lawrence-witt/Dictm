import { ThunkResult } from '../../store';

import User from '../../../db/models/User';
import { UserController } from '../../../db/controllers/User';

import * as actions from './actions';
import * as types from './types';

import { recordingOperations } from '../content/recordings';
import { noteOperations } from '../content/notes';
import { categoryOperations } from '../content/categories';

/** 
*  Summary:
*  Load a user and their data into the application
*/

// TODO: create a session object

export const loadUser = (
    profile: User
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    const userData = await (async () => {
        try {
            return await UserController.selectUserData(profile);
        } catch (err) {
            // handle cannot get data
            console.log(err);
            return;
        }
    })();

    if (!userData) return;

    dispatch(recordingOperations.loadRecordings(userData.recordings));
    dispatch(noteOperations.loadNotes(userData.notes));
    dispatch(categoryOperations.loadCategories(userData.categories));
    dispatch(actions.loadUser(profile));

    // create session object
}

/** 
*  Summary:
*  Clear a user and their data from the store
*/

// TODO: clear the session object

export const clearUser = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(recordingOperations.clearRecordings());
    dispatch(noteOperations.clearNotes());
    dispatch(categoryOperations.clearCategories());
    dispatch(actions.clearUser());

    // clear session object
}