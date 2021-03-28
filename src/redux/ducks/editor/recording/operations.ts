import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../../store';

import { RecordingModel } from '../../../_data/recordingsData';

import { editorOperations, editorHelpers } from '..';
import { categoryOperations } from '../../categories';
import { recordingOperations } from '../../media/recordings';

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
    data: RecordingModel["data"]
): UpdateRecordingDataThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorData(data));
}

type UpdateRecordingDataThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorDataUpdatedAction>;

/** 
*  Summary:
*  Saves the currently editing Recording Model.
*
*  Description
*  Updates any categories it has been added to or removed from.
*  Persists or overwrites the Recording depending on its isNew status.
*/

export const saveRecordingEditorModel = (): SaveRecordingEditorThunkAction => (
    dispatch,
    getState
): void => {
    dispatch(editorOperations.setEditorSaving());

    const { editor } = getState();

    if (!editor.context || editor.context.type !== "recording") {
        throw new Error('Recording Editor context has not been initialised.');
    }

    const { data } = editor.context;
    
    const originalCategory = data.original.relationships.category?.id;
    const editingCategory = data.editing.relationships.category?.id;

    if (originalCategory !== editingCategory) {
        originalCategory &&
            dispatch(categoryOperations.removeCategoryIds(originalCategory, "recordings", [data.editing.id]));
        editingCategory &&
            dispatch(categoryOperations.addCategoryIds(editingCategory, "recordings", [data.editing.id]));
    }

    const stamped = editorHelpers.stampContentModel(data.editing);

    if (editor.attributes.isNew) {
        dispatch(recordingOperations.createRecording(stamped));
    } else {
        dispatch(recordingOperations.overwriteRecording(stamped));
    }

    dispatch(editorOperations.openEditor("recording", data.editing.id));
}

type SaveRecordingEditorThunkAction = ThunkAction<void, RootState, unknown, any>;