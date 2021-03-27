import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

import { RootState } from '../../store';
import { categoryOperations } from '../categories';
import { recordingOperations } from '../media/recordings';
import { noteOperations } from '../media/notes';

import { RecordingModel } from '../../_data/recordingsData';

/* 
*   BASE EDITOR OPERATIONS
*/

/** 
*  Summary 
*  Opens the editor modal.
*
*  Description 
*  Generates a new content model to match editorType if the contentId is "new".
*  Validates model was created or found, and generates an editor context.
*  Saves the editorType and contentId to sessionStorage to facilitate page reloading.
*  
*  @param {types.EditorTypes} editorType The type of editor panel which should be opened.
*  @param {string} contentId Either a random string identifying the content or "new".
*/

export const openEditor = (
    editorType: types.EditorModelTypes,
    contentId: string
): OpenEditorThunkAction => (
    dispatch, 
    getState
): void => {
    const { user, media, categories } = getState();

    const isNew = contentId === "new";
    let model: types.EditorModels | undefined;

    if (editorType === "choose" || isNew) {
        model = helpers.generateContentModel(editorType, user.id);
    } else {
        model = helpers.findContentModel(media, categories, editorType, contentId);
    }

    if (!model) {
        // TODO: dispatch notification error
        return;
    }
    
    const { title, context } = helpers.generateEditorContext(model, isNew);

    // TODO: save editorType and contentId in sessionStorage
    dispatch(actions.openEditor(title, isNew, context));
}

type OpenEditorThunkAction = ThunkAction<void, RootState, unknown, types.EditorOpenedAction>;

/** 
*  Summary 
*  Closes the editor modal.
*
*  Description 
*  Sets the editor isOpen state to false.
*/

export const closeEditor = (): CloseEditorThunkAction => (
    dispatch
): void => {
    dispatch(actions.closeEditor());
}

type CloseEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClosedAction>;

/** 
*  Summary
*  Clears the editor modal.
*
*  Description
*  Resets the editor to its initialState.
*  Removes the editorType and contentId from sessionStorage.
*/

export const clearEditor = (): ClearEditorThunkAction => (
    dispatch
): void => {
    // TODO: remove editorType and contentId in sessionStorage
    dispatch(actions.clearEditor());
}

type ClearEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClearedAction>;

/* 
*   RECORDING EDITOR OPERATIONS
*/

/** 
*  Summary
*  Changes the editor mode between 'play' and 'edit'.
*
*  @param {"edit" | "play"} mode The new editor mode.
*/

export const updateRecordingEditorMode = (
    mode: "edit" | "play"
): uREMThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorMode(mode));
}

type uREMThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorModeUpdatedAction>;

/** 
*  Summary
*  Updates the title string for a Recording Model.
*
*  @param {string} title The new title for the model.
*/

export const updateRecordingEditorTitle = (
    title: string
): uRETThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorTitle(title));
}

type uRETThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorTitleUpdatedAction>;

/** 
*  Summary
*  Updates the category for a Recording Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

export const updateRecordingEditorCategory = (
    id?: string
): uRECThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorCategory(id));
}

type uRECThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorCategoryUpdatedAction>;

/** 
*  Summary:
*  Updates the recording data for a Recording Model.
*
*  @param {object} data A data object containing the most recent audio/frequency capture.
*/

export const updateRecordingEditorData = (
    data: RecordingModel["data"]
): uREDThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorData(data));
}

type uREDThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorDataUpdatedAction>;

/** 
*  Summary:
*  Saves the currently editing Recording Model.
*
*  Description
*  Updates any categories it has been added to or removed from.
*  Persists or overwrites the Recording depending on its isNew status.
*/

export const saveRecordingEditorModel = (): sREMThunkAction => (
    dispatch,
    getState
): void => {
    dispatch(actions.setEditorSaving());

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

    if (editor.attributes.isNew) {
        dispatch(recordingOperations.createRecording(helpers.stampContentModel(data.editing)));
    } else {
        dispatch(recordingOperations.overwriteRecording(helpers.stampContentModel(data.editing)));
    }

    dispatch(openEditor("recording", data.editing.id));
}

type sREMThunkAction = ThunkAction<void, RootState, unknown, any>;

/* 
*   NOTE EDITOR OPERATIONS
*/

/** 
*  Summary
*  Updates the title string for a Note Model.
*
*  @param {string} title The new title for the model.
*/

export const updateNoteEditorTitle = (
    title: string
): uNETThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteEditorTitle(title));
}

type uNETThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorTitleUpdatedAction>;

/** 
*  Summary
*  Updates the category for a Note Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

export const updateNoteEditorCategory = (
    id?: string
): uNECThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteEditorCategory(id));
}

type uNECThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorCategoryUpdatedAction>;

/** 
*  Summary
*  Updates the text data for a Note Model.
*
*  @param {object} content A string containing the content of the note.
*/

export const updateNoteEditorData = (
    content: string
): uNEDThunkAction => (
    dispatch
): void => {
    const wordCount = (() => {
        const matches = content.match(/[\w\d\’\'-]+/gi);
        return matches ? matches.length : 0;
    })();

    const fullData = {
        content,
        charCount: content.length,
        wordCount
    }

    dispatch(actions.updateNoteEditorData(fullData));
}

type uNEDThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorDataUpdatedAction>;

/** 
*  Summary:
*  Saves the currently editing Note Model.
*
*  Description
*  Updates any categories it has been added to or removed from.
*  Persists or overwrites the Note depending on its isNew status.
*/

export const saveNoteEditorModel = (): sNEMThunkAction => (
    dispatch,
    getState
): void => {
    dispatch(actions.setEditorSaving());

    const { editor } = getState();

    if (!editor.context || editor.context.type !== "note") {
        throw new Error('Note Editor context has not been initialised.');
    }

    const { data } = editor.context;
    
    const originalCategory = data.original.relationships.category?.id;
    const editingCategory = data.editing.relationships.category?.id;

    if (originalCategory !== editingCategory) {
        originalCategory &&
            dispatch(categoryOperations.removeCategoryIds(originalCategory, "notes", [data.editing.id]));
        editingCategory &&
            dispatch(categoryOperations.addCategoryIds(editingCategory, "notes", [data.editing.id]));
    }

    if (editor.attributes.isNew) {
        dispatch(noteOperations.createNote(helpers.stampContentModel(data.editing)));
    } else {
        dispatch(noteOperations.overwriteNote(helpers.stampContentModel(data.editing)));
    }

    dispatch(openEditor("note", data.editing.id));
}

type sNEMThunkAction = ThunkAction<void, RootState, unknown, any>;

/* 
*   CATEGORY EDITOR OPERATIONS
*/

/** 
*  Summary: 
*  Updates the title string for a Category Model.
*
*  @param {string} title The new title for the model.
*/

export const updateCategoryEditorTitle = (
    title: string
): uCETThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorTitle(title));
}

type uCETThunkAction = ThunkAction<void, undefined, unknown, types.CategoryEditorTitleUpdatedAction>;

/** 
*  Summary:
*  Upates the resource ids for a particular type on a Category Model.
*
*  @param {"recording" | "note"} type The type of resource being updated.
*  @param {string} ids An array containing the new resource ids.
*/

export const updateCategoryEditorIds = (
    type: "recordings" | "notes",
    ids: string[]
): uCEIThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorIds(type, ids));
}

type uCEIThunkAction = ThunkAction<void, undefined, unknown, types.CategoryEditorIdsUpdatedAction>;