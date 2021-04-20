import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

import { RootState } from '../../store';

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
): OpenEditorThunkAction => (
    dispatch,
    getState
): void => {
    const { user, content } = getState();

    const isNew = contentId === "new";
    let model: types.EditorModels | undefined;

    if (editorType === "choose" || isNew) {
        model = helpers.generateContentModel(editorType, user.profile.id);
    } else {
        model = helpers.findContentModel(content, editorType, contentId);
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
*  Summary:
*  Sets the editor isSaving flag to true.
*/

export const setEditorSaving = (): SetEditorSavingThunkAction => (
    dispatch
): void => {
    dispatch(actions.setEditorSaving());
}

type SetEditorSavingThunkAction = ThunkAction<void, undefined, unknown, types.EditorSetSavingAction>;

/** 
*  Summary:
*  Saves the content model currently being edited.
*/

export const saveEditor = (): SaveEditorThunkAction => (
    dispatch,
    getState
) => {
    dispatch(actions.setEditorSaving());

    const { context, attributes: { isNew }, dialogs } = getState().editor;
    
    if (!context || context.type === "choose") {
        throw new Error('An editable context has not been initialised.');
    }

    const stamped = helpers.stampContentModel(
        context.data.editing
    );

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

    persist()
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

type SaveEditorThunkAction = ThunkAction<void, RootState, unknown, any>;

/** 
*  Summary:
*  Sets the editor isSaving flag to false.
*/

export const unsetEditorSaving = (): UnsetEditorSavingThunkAction => (
    dispatch
): void => {
    dispatch(actions.unsetEditorSaving());
}

type UnsetEditorSavingThunkAction = ThunkAction<void, undefined, unknown, types.EditorUnsetSavingAction>;

/** 
*  Summary:
*  Opens the save editor dialog.
*/

export const openSaveDialog = (): OpenSaveDialogThunkAction => (
    dispatch
): void => {
    dispatch(actions.openSaveDialog());
}

type OpenSaveDialogThunkAction = ThunkAction<void, undefined, unknown, types.EditorOpenSaveDialogAction>;

/** 
*  Summary:
*  Opens the details editor dialog.
*/

export const openDetailsDialog = (): OpenDetailsDialogThunkAction => (
    dispatch
): void => {
    dispatch(actions.openDetailsDialog());
}

type OpenDetailsDialogThunkAction = ThunkAction<void, undefined, unknown, types.EditorOpenDetailsDialogAction>;

/** 
*  Summary:
*  Closes any open editor dialogs.
*/

export const closeDialog = (): CloseDialogThunkAction => (
    dispatch
): void => {
    dispatch(actions.closeDialog());
}

type CloseDialogThunkAction = ThunkAction<void, undefined, unknown, types.EditorCloseDialogAction>;

/** 
*  Summar:
*  Closes the editor modal.
*/

export const closeEditor = (): CloseEditorThunkAction => (
    dispatch,
    getState
): void => {
    const { dialogs } = getState().editor;

    if (dialogs.save.isOpen || dialogs.details.isOpen) {
        dispatch(closeDialog());
    }

    dispatch(actions.closeEditor());
}

type CloseEditorThunkAction = ThunkAction<void, RootState, unknown, any>;

/** 
*  Summary:
*  Clears context from closed editor.
*/

export const clearEditor = (): ClearEditorThunkAction => (
    dispatch
): void => {
    // TODO: remove editorType and contentId in sessionStorage
    dispatch(actions.clearEditor());
}

type ClearEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClearedAction>;