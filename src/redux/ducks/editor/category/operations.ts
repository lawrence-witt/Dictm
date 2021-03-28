import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../../store';

import * as actions from './actions';
import * as types from './types';

import { editorOperations, editorHelpers } from '..';
import { recordingOperations } from '../../media/recordings';
import { noteOperations } from '../../media/notes';
import { categoryOperations } from '../../categories';

/** 
*  Summary: 
*  Updates the title string for a Category Model.
*
*  @param {string} title The new title for the model.
*/

export const updateCategoryEditorTitle = (
    title: string
): UpdateCategoryTitleThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorTitle(title));
}

type UpdateCategoryTitleThunkAction = ThunkAction<void, undefined, unknown, types.CategoryEditorTitleUpdatedAction>;

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
): UpdateCategoryIdsThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorIds(type, ids));
}

type UpdateCategoryIdsThunkAction = ThunkAction<void, undefined, unknown, types.CategoryEditorIdsUpdatedAction>;

/** 
*  Summary:
*  Saves the currently editing Category Model.
*
*  Description
*  Updates any media models that have been added to or removed from it.
*  Persists or overwrites the Category depending on its isNew status.
*/

// TODO: batch the other model updates

export const saveCategoryEditorModel = (): SaveCategoryEditorThunkAction => (
    dispatch,
    getState
): void => {
    dispatch(editorOperations.setEditorSaving());

    const { editor, media } = getState();

    if (!editor.context || editor.context.type !== "category") {
        throw new Error('Category Editor context has not been initialised.');
    }

    const { data } = editor.context;

    const originalRecordingIds = data.original.relationships.recordings.ids;
    const originalNoteIds = data.original.relationships.notes.ids;
    const editingRecordingIds = data.editing.relationships.recordings.ids;
    const editingNoteIds = data.editing.relationships.notes.ids;

    originalRecordingIds.forEach(id => {
        if (!editingRecordingIds.includes(id)) {
            dispatch(recordingOperations.updateRecordingCategory(id, undefined));
        }
    });

    originalNoteIds.forEach(id => {
        if (!editingNoteIds.includes(id)) {
            dispatch(noteOperations.updateNoteCategory(id, undefined));
        }
    });

    editingRecordingIds.forEach(id => {
        if (!originalRecordingIds.includes(id)) {
            const assignedCategory = media.recordings.byId[id].relationships.category;

            if (assignedCategory) {
                dispatch(categoryOperations.removeCategoryIds(assignedCategory.id, "recordings", [id]));
            }

            dispatch(recordingOperations.updateRecordingCategory(id, data.editing.id));
        }
    });

    editingNoteIds.forEach(id => {
        if (!originalNoteIds.includes(id)) {
            const assignedCategory = media.notes.byId[id].relationships.category;

            if (assignedCategory) {
                dispatch(categoryOperations.removeCategoryIds(assignedCategory.id, "notes", [id]));
            }

            dispatch(noteOperations.updateNoteCategory(id, data.editing.id));
        }
    });

    const stamped = editorHelpers.stampContentModel(data.editing);

    if (editor.attributes.isNew) {
        dispatch(categoryOperations.createCategory(stamped));
    } else {
        dispatch(categoryOperations.overwriteCategory(stamped));
    }

    dispatch(editorOperations.openEditor("category", data.editing.id));
}

type SaveCategoryEditorThunkAction = ThunkAction<void, RootState, unknown, any>;