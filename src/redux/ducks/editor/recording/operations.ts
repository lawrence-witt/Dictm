import { ThunkAction } from 'redux-thunk';

import Recording from '../../../../db/models/Recording';

import * as actions from './actions';
import * as types from './types';

/** 
*  Summary
*  Changes the editor mode between 'play' and 'edit'.
*
*  @param {"edit" | "play"} mode The new editor mode.
*/

export const updateRecordingEditorMode = (
    mode: "edit" | "play"
): UpdateRecordingModeThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorMode(mode));
}

type UpdateRecordingModeThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorModeUpdatedAction>;

/** 
*  Summary
*  Updates the title string for a Recording Model.
*
*  @param {string} title The new title for the model.
*/

export const updateRecordingEditorTitle = (
    title: string
): UpdateRecordingTitleThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorTitle(title));
}

type UpdateRecordingTitleThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorTitleUpdatedAction>;

/** 
*  Summary
*  Updates the category for a Recording Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

export const updateRecordingEditorCategory = (
    id?: string
): UpdateRecordingCategoryThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorCategory(id));
}

type UpdateRecordingCategoryThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorCategoryUpdatedAction>;

/** 
*  Summary:
*  Updates the recording data for a Recording Model.
*
*  @param {object} data A data object containing the most recent audio/frequency capture.
*/

export const updateRecordingEditorData = (
    data: Recording["data"]
): UpdateRecordingDataThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorData(data));
}

type UpdateRecordingDataThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorDataUpdatedAction>;