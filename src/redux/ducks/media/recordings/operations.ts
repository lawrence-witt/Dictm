import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import Recording from '../../../../db/models/Recording';

/** 
*  Summary:
*  Loads the users recordings into the store
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
*  Persists a new Recording Model.
*
*  Description:
*  Adds the Recording Model to the database.
*  Adds the Recording Model to the store.
*
*  @param {object} recording The new Recording Model.
*/

export const createRecording = (
    recording: Recording
): CreateRecordingThunkAction => (
    dispatch
): void => {
    // TODO: add to database
    dispatch(actions.createRecording(recording));
}

type CreateRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingCreatedAction>;

/** 
*  Summary:
*  Overwrites a Recording Model.
*
*  Description:
*  Updates the Recording Model in the database.
*  Updates the NotRecordinge Model in the store.
*
*  @param {object} recording The updated Recording Model.
*/

export const overwriteRecording = (
    recording: Recording
): OverwriteRecordingThunkAction => (
    dispatch
): void => {
    // TODO: update in database
    dispatch(actions.overwriteRecording(recording));
}

type OverwriteRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingOverwrittenAction>;

/** 
*  Summary:
*  Updates the category of a Recording Model.
*
*  Description:
*  Updates the model's category in the database.
*  Updates the model's category in the store.
*
*  @param {string} id The id identifying the Recording Model.
*  @param {string | undefined} categoryId The id (or undefined) identifying the new category.
*/

export const updateRecordingCategory = (
    id: string,
    categoryId: string | undefined
): UpdateRecordingCategoryThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingCategory(id, categoryId));
}

type UpdateRecordingCategoryThunkAction = ThunkAction<void, undefined, unknown, types.RecordingCategoryUpdatedAction>;

/** 
*  Summary:
*  Deletes a Recording Model.
*
*  Description:
*  Deletes the Recording Model from the database.
*  Deletes the Recording Model from the store.
*
*  @param {string} id The id identifying the Recording Model.
*/

export const deleteRecording = (
    id: string
): DeleteRecordingThunkAction => (
    dispatch
): void => {
    // TODO: remove database record
    dispatch(actions.deleteRecording(id));
}

type DeleteRecordingThunkAction = ThunkAction<void, undefined, unknown, types.RecordingDeletedAction>;