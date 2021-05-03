import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

import { ThunkResult } from '../../store';

import { userOperations } from '../user';
import { recordingOperations } from '../content/recordings';
import { noteOperations } from '../content/notes';
import { categoryOperations } from '../content/categories';

const { createRecording, updateRecording } = recordingOperations;
const { createNote, updateNote } = noteOperations;
const { createCategory, updateCategory } = categoryOperations;

/** 
*  Summary 
*  Opens the editor modal with a new or existing content model.
*/

export const openEditor = (
    editorType: types.EditorModelTypes,
    contentId: string,
    newContentCategoryId?: string
): ThunkResult<void> => (
    dispatch,
    getState
) => {
    const { user, content } = getState();

    if (!user.profile) return;

    const isNew = contentId === "new";

    const model = (() => {
        if (editorType === "choose" || isNew) {
            return helpers.generateContentModel(editorType, user.profile.id, newContentCategoryId);
        } else {
            return helpers.findContentModel(content, editorType, contentId);
        }
    })();

    if (!model) return;
    
    const { title, context } = helpers.generateEditorContext(model, isNew);

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

export const saveEditor = (): ThunkResult<Promise<void>> => async (
    dispatch,
    getState
) => {
    dispatch(actions.setEditorSaving());

    const { context, attributes: { isNew }, dialogs } = getState().editor;
    
    if (!context || context.type === "choose") {
        throw new Error('An editable context has not been initialised.');
    }

    const stamped = helpers.stampContentModel(context.model);

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

    try {
        await dispatch(persist());

        dispatch(userOperations.checkUserStorage());

        if (dialogs.save.isOpen) {
            dispatch(closeEditor());
        } else {
            dispatch(openEditor(context.type, stamped.id));
        }
    } catch {
        dispatch(actions.unsetEditorSaving());
    }
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
    dispatch(actions.clearEditor());
}