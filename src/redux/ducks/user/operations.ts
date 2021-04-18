import { ThunkAction } from 'redux-thunk';

import User from '../../../db/models/User';
import { UserController } from '../../../db/controllers/User';

import * as actions from './actions';

import { recordingOperations } from '../content/recordings';
import { noteOperations } from '../content/notes';
import { categoryOperations } from '../content/categories';

/** 
*  Summary:
*  Load a user and their locally stored data into the application
*/

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
}

type LoadUserThunkAction = ThunkAction<void, undefined, unknown, any>;