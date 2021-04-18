import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import { categoryOperations } from '../categories';

import Recording from '../../../../db/models/Recording';
import { RecordingController } from '../../../../db/controllers/Recording';

/** 
*  Summary:
*  Loads the users Recordings into the store from DB.
*/

export const loadRecordings = (
    recordings: Recording[]
): LoadRecordingsThunkAction => (
    dispatch
): void => {
    dispatch(actions.loadRecordings(recordings));
}

type LoadRecordingsThunkAction = ThunkAction<void, undefined, unknown, types.RecordingsLoadedAction>;

/** 
*  Summary:
*  Saves a single new Recording in store and DB.
*/

export const createRecording = async (
    recording: Recording
): Promise<CreateRecordingThunkAction> => async (
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

type CreateRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingCreatedAction>;

/** 
*  Summary:
*  Saves a single updated Recording in store and DB.
*/

export const updateRecording = async (
    recording: Recording
): Promise<UpdateRecordingThunkAction> => async (
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

type UpdateRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingsOverwrittenAction>;

/** 
*  Summary:
*  Overwrites multiple updated Recordings in store according to id.
*/

export const overwriteRecordings = (
    recordings: Recording[]
): OverwriteRecordingThunkAction => (
    dispatch
): void => {
    dispatch(actions.overwriteRecordings(recordings));
}

type OverwriteRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingsOverwrittenAction>;

/** 
*  Summary:
*  Deletes multiple Recordings from store and DB.
*
*/

export const deleteRecordings = (
    ids: string[]
): DeleteRecordingThunkAction => (
    dispatch
): void => {
    // TODO: remove database records
    dispatch(actions.deleteRecordings(ids));
}

type DeleteRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingsDeletedAction>;