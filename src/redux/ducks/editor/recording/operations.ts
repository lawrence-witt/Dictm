import Recording from '../../../../db/models/Recording';
import { ThunkResult } from '../../../store';

import * as actions from './actions';

/** 
*  Summary
*  Changes the editor mode between 'play' and 'edit'.
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
*/

export const updateRecordingEditorCategory = (
    id?: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorCategory(id));
}

/* 
*   Summary:
*   Updates the audio attributes of a Recording following a successful capture.
*/

export const updateRecordingEditorAttributes = (
    attributes: Recording["data"]["audio"]["attributes"]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorAttributes(attributes));
}

/** 
*  Summary:
*  Updates the recording data for a Recording Model.
*/

export const updateRecordingEditorData = (
    data: Recording["data"]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorData(data));
}

/** 
*  Summary:
*  Updates the isSaveRequested flag.
*/

export const updateRecordingEditorSaving = (
    saving: boolean
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateRecordingEditorSaving(saving));
}