import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

import { ThunkResult } from '../../store';

import { recordingOperations } from '../content/recordings';
import { noteOperations } from '../content/notes';
import { categoryOperations } from '../content/categories';

const { createRecording, updateRecording } = recordingOperations;
const { createNote, updateNote } = noteOperations;
const { createCategory, updateCategory } = categoryOperations;

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
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { user, content } = getState();

    const isNew = contentId === "new";
    let model: types.EditorModels | undefined;

    if (editorType === "choose" || isNew) {
        model = helpers.generateContentModel(editorType, user.profile.id);
    } else {
        model = helpers.findContentModel(content, editorType, contentId);
    }

    if (!model) return;
    
    const { title, context } = helpers.generateEditorContext(model, isNew);

    // TODO: save editorType and contentId in sessionStorage
    dispatch(actions.openEditor(title, isNew, context));
}

/** 
*  Summary:
*  Sets the editor isSaving flag to true.
*/

export const setEditorSaving = (): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.setEditorSaving());
}

/** 
*  Summary:
*  Saves the content model currently being edited.
*/

export const saveEditor = (): ThunkResult<void> => (
    dispatch,
    getState
) => {
    dispatch(actions.setEditorSaving());

    const { context, attributes: { isNew }, dialogs } = getState().editor;
    
    if (!context || context.type === "choose") {
        throw new Error('An editable context has not been initialised.');
    }

    const stamped = helpers.stampContentModel(context.data.editing);

    const persist = () => {
        switch(stamped.type) {
            case "recording":
                return isNew ? createRecording(stamped) : updateRecording(stamped);
            case "note":
                return isNew ? createNote(stamped) : updateNote(stamped);
            case "category":
                return isNew ? createCategory(stamped) : updateCategory(stamped);
        }
    }

    dispatch(persist())
    .then(() => {
        if (dialogs.save.isOpen) {
            dispatch(closeEditor());
        } else {
            dispatch(openEditor(context.type, stamped.id));
        }
    })
    .catch(() => {
        dispatch(actions.unsetEditorSaving());
    });
}

/** 
*  Summary:
*  Sets the editor isSaving flag to false.
*/

export const unsetEditorSaving = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.unsetEditorSaving());
}

/** 
*  Summary:
*  Opens the save editor dialog.
*/

export const openSaveDialog = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.openSaveDialog());
}

/** 
*  Summary:
*  Opens the details editor dialog.
*/

export const openDetailsDialog = (): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.openDetailsDialog());
}

/** 
*  Summary:
*  Closes any open editor dialogs.
*/

export const closeDialog = (): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.closeDialog());
}

/** 
*  Summar:
*  Closes the editor modal.
*/

export const closeEditor = (): ThunkResult<void> => (
    dispatch,
    getState
): void => {
    const { dialogs } = getState().editor;

    if (dialogs.save.isOpen || dialogs.details.isOpen) {
        dispatch(closeDialog());
    }

    dispatch(actions.closeEditor());
}

/** 
*  Summary:
*  Clears context from closed editor.
*/

export const clearEditor = (): ThunkResult<void> => (
    dispatch
): void => {
    // TODO: remove editorType and contentId in sessionStorage
    dispatch(actions.clearEditor());
}