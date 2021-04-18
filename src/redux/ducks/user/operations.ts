import { ThunkAction } from 'redux-thunk';

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
): LoadUserThunkAction => async (
    dispatch
): Promise<void> => {
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

type LoadUserThunkAction = ThunkAction<void, undefined, unknown, types.UserLoadedAction>;

/** 
*  Summary:
*  Clear a user and their data from the store
*/

// TODO: clear the session object

export const clearUser = (): ClearUserThunkAction => (
    dispatch
) => {
    dispatch(recordingOperations.clearRecordings());
    dispatch(noteOperations.clearNotes());
    dispatch(categoryOperations.clearCategories());
    dispatch(actions.clearUser());

    // clear session object
}

type ClearUserThunkAction = ThunkAction<void, undefined, unknown, types.UserClearedAction>;