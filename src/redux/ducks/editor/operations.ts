import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

import { RecordingModel } from '../../_data/recordingsData';

import { RootState } from '../../store';

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

type OpenEditorThunkAction = ThunkAction<void, RootState, unknown, types.EditorOpenedAction>;

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

/** 
*  Summary 
*  Closes the editor modal.
*
*  Description 
*  Sets the editor isOpen state to false.
*/

type CloseEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClosedAction>;

export const closeEditor = (): CloseEditorThunkAction => (
    dispatch
): void => {
    dispatch(actions.closeEditor());
}

/** 
*  Summary
*  Clears the editor modal.
*
*  Description
*  Resets the editor to its initialState.
*  Removes the editorType and contentId from sessionStorage.
*/

type ClearEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClearedAction>;

export const clearEditor = (): ClearEditorThunkAction => (
    dispatch
): void => {
    // TODO: remove editorType and contentId in sessionStorage
    dispatch(actions.clearEditor());
}

/* 
*   RECORDING EDITOR OPERATIONS
*/

/** 
*  Summary
*  Changes the editor mode between 'play' and 'edit'.
*
*  @param {"edit" | "play"} mode The new editor mode.
*/

type uREMThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorModeUpdatedAction>;

export const updateRecordingEditorMode = (
    mode: "edit" | "play"
): uREMThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorMode(mode));
}

/** 
*  Summary
*  Updates the title string for a Recording Model.
*
*  @param {string} title The new title for the model.
*/

type uRETThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorTitleUpdatedAction>;

export const updateRecordingEditorTitle = (
    title: string
): uRETThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorTitle(title));
}

/** 
*  Summary
*  Updates the category for a Recording Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

type uRECThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorCategoryUpdatedAction>;

export const updateRecordingEditorCategory = (
    id?: string
): uRECThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorCategory(id));
}

/** 
*  Summary
*  Updates the recording data for a Recording Model.
*
*  @param {object} data A data object containing the most recent audio/frequency capture.
*/

type uREDThunkAction = ThunkAction<void, undefined, unknown, types.RecordingEditorDataUpdatedAction>;

export const updateRecordingEditorData = (
    data: RecordingModel["data"]
): uREDThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateRecordingEditorData(data));
}

/* 
*   NOTE EDITOR OPERATIONS
*/

/** 
*  Summary
*  Updates the title string for a Note Model.
*
*  @param {string} title The new title for the model.
*/

type uNETThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorTitleUpdatedAction>;

export const updateNoteEditorTitle = (
    title: string
): uNETThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteEditorTitle(title));
}

/** 
*  Summary
*  Updates the category for a Note Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

type uNECThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorCategoryUpdatedAction>;

export const updateNoteEditorCategory = (
    id?: string
): uNECThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteEditorCategory(id));
}

/** 
*  Summary
*  Updates the text data for a Note Model.
*
*  @param {object} content A string containing the content of the note.
*/

type uNEDThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorDataUpdatedAction>;

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

/* 
*   CATEGORY EDITOR OPERATIONS
*/

/** 
*  Summary
*  Updates the title string for a Category Model.
*
*  @param {string} title The new title for the model.
*/

type uCETThunkAction = ThunkAction<void, undefined, unknown, types.CategoryEditorTitleUpdatedAction>;

export const updateCategoryEditorTitle = (
    title: string
): uCETThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorTitle(title));
}

/** 
*  Summary
*  Upates the resource ids for a particular type on a Category Model.
*
*  @param {"recording" | "note"} type The type of resource being updated.
*  @param {string} ids An array containing the new resource ids.
*/

type uCEIThunkAction = ThunkAction<void, undefined, unknown, types.CategoryEditorIdsUpdatedAction>;

export const updateCategoryEditorIds = (
    type: "recordings" | "notes",
    ids: string[]
): uCEIThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorIds(type, ids));
}