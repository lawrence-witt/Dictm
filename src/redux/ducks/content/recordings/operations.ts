import { ThunkResult } from '../../../store';

import * as actions from './actions';

import Recording from '../../../../db/models/Recording';
import RecordingController from '../../../../db/controllers/Recording';

import { categoryOperations } from '../categories';
import { notificationsOperations } from '../../notifications';

const { notifyDatabaseError } = notificationsOperations;

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
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!data) return Promise.reject();

    const { recording: newRecording, updatedCategories } = data;

    dispatch(actions.createRecording(newRecording));

    if (updatedCategories.length > 0) {
        return dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }
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
            dispatch(notifyDatabaseError(err.message));
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
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    if (ids.length === 0) return Promise.resolve();

    const data = await (async () => {
        try {
            return await RecordingController.deleteRecordings(ids);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!data) return Promise.reject();
    
    const { updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.deleteRecordings(ids));
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