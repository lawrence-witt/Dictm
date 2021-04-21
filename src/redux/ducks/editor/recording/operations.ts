import Recording from '../../../../db/models/Recording';
import { ThunkResult } from '../../../store';

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
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorMode(mode));
}

/** 
*  Summary
*  Updates the title string for a Recording Model.
*
*  @param {string} title The new title for the model.
*/

export const updateRecordingEditorTitle = (
    title: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorTitle(title));
}

/** 
*  Summary
*  Updates the category for a Recording Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

export const updateRecordingEditorCategory = (
    id?: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorCategory(id));
}

/** 
*  Summary:
*  Updates the recording data for a Recording Model.
*
*  @param {object} data A data object containing the most recent audio/frequency capture.
*/

export const updateRecordingEditorData = (
    data: Recording["data"]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorData(data));
}