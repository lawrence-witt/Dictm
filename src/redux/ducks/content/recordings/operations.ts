import * as types from './types';
import * as actions from './actions';

import { categoryOperations } from '../categories';

import Recording from '../../../../db/models/Recording';
import { RecordingController } from '../../../../db/controllers/Recording';
import { RootState, ThunkResult } from '../../../store';

/** 
*  Summary:
*  Loads the users Recordings into the store from DB.
*/

export const loadRecordings = (
    recordings: Recording[]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.loadRecordings(recordings));
}

/** 
*  Summary:
*  Saves a single new Recording in store and DB.
*/

export const createRecording = (
    recording: Recording
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await RecordingController.insertRecording(recording);
        } catch (err) {
            // handle no recording creation
            console.log(err);
        }
    })();

    if (!data) return Promise.reject();

    const { recording: newRecording, updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.createRecording(newRecording));
}

/** 
*  Summary:
*  Saves a single updated Recording in store and DB.
*/

export const updateRecording = (
    recording: Recording
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await RecordingController.updateRecording(recording);
        } catch (err) {
            // handle no recording update
            console.log(err);
        }
    })();

    if (!data) return Promise.reject();

    const { recording: updatedRecording, updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.overwriteRecordings([updatedRecording]));
}

/** 
*  Summary:
*  Overwrites multiple updated Recordings in store according to id.
*/

export const overwriteRecordings = (
    recordings: Recording[]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.overwriteRecordings(recordings));
}

/** 
*  Summary:
*  Deletes multiple Recordings from store and DB.
*
*/

export const deleteRecordings = (
    ids: string[]
): ThunkResult<void> => (
    dispatch
): void => {
    // TODO: remove database records
    dispatch(actions.deleteRecordings(ids));
}

/** 
*  Summary:
*  Clears recordings from the store on user sign out.
*
*/

export const clearRecordings = (): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.clearRecordings());
}