import * as types from './types';

import { RecordingModel } from '../../_data/recordingsData';
import { NoteModel } from '../../_data/notesData';

/* 
*   Editor Base Actions
*/

export const openEditor = (
    title: string,
    isNew: boolean,
    context: types.EditorContexts[keyof types.EditorContexts]
): types.EditorOpenedAction => ({
    type: types.EDITOR_OPENED,
    payload: {
        title,
        isNew,
        context
    }
});

export const closeEditor = (): types.EditorClosedAction => ({
    type: types.EDITOR_CLOSED
});

export const clearEditor = (): types.EditorClearedAction => ({
    type: types.EDITOR_CLEARED
});

/* 
*   Recording Context Actions
*/

export const updateRecordingEditorMode = (
    mode: "edit" | "play"
): types.RecordingEditorModeUpdatedAction => ({
    type: types.RECORDING_EDITOR_MODE_UPDATED,
    payload: {
        mode
    }
});

export const updateRecordingEditorTitle = (
    title: string
): types.RecordingEditorTitleUpdatedAction => ({
    type: types.RECORDING_EDITOR_TITLE_UPDATED,
    payload: {
        title
    }
});

export const updateRecordingEditorCategory = (
    id?: string
): types.RecordingEditorCategoryUpdatedAction => ({
    type: types.RECORDING_EDITOR_CATEGORY_UPDATED,
    payload: {
        id
    }
});

export const updateRecordingEditorData = (
    data: RecordingModel["data"]
): types.RecordingEditorDataUpdatedAction => ({
    type: types.RECORDING_EDITOR_DATA_UPDATED,
    payload: {
        data
    }
});

/* 
*   Note Context Actions
*/

export const updateNoteEditorTitle = (
    title: string
): types.NoteEditorTitleUpdatedAction => ({
    type: types.NOTE_EDITOR_TITLE_UPDATED,
    payload: {
        title
    }
});

export const updateNoteEditorCategory = (
    id?: string
): types.NoteEditorCategoryUpdatedAction => ({
    type: types.NOTE_EDITOR_CATEGORY_UPDATED,
    payload: {
        id
    }
});

export const updateNoteEditorData = (
    data: NoteModel["data"]
): types.NoteEditorDataUpdatedAction => ({
    type: types.NOTE_EDITOR_DATA_UPDATED,
    payload: {
        data
    }
});

/* 
*   Category Context Actions
*/

export const updateCategoryEditorTitle = (
    title: string
): types.CategoryEditorTitleUpdatedAction => ({
    type: types.CATEGORY_EDITOR_TITLE_UPDATED,
    payload: {
        title
    }
});

export const updateCategoryEditorIds = (
    type: "recordings" | "notes",
    ids: string[]
): types.CategoryEditorIdsUpdatedAction => ({
    type: types.CATEGORY_EDITOR_IDS_UPDATED,
    payload: {
        type,
        ids
    }
});