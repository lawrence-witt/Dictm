import { ThunkAction } from 'redux-thunk';

import { RootState } from '../../../store';

import { noteOperations } from '../../media/notes';
import { categoryOperations } from '../../categories';

import { editorHelpers } from '..';
import { editorOperations } from '..';

import * as actions from './actions';
import * as types from './types';

/** 
*  Summary
*  Updates the title string for a Note Model.
*
*  @param {string} title The new title for the model.
*/

export const updateNoteEditorTitle = (
    title: string
): UpdateNoteTitleThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteEditorTitle(title));
}

type UpdateNoteTitleThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorTitleUpdatedAction>;

/** 
*  Summary
*  Updates the category for a Note Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

export const updateNoteEditorCategory = (
    id?: string
): UpdateNoteCategoryThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteEditorCategory(id));
}

type UpdateNoteCategoryThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorCategoryUpdatedAction>;

/** 
*  Summary
*  Updates the text data for a Note Model.
*
*  @param {object} content A string containing the content of the note.
*/

export const updateNoteEditorData = (
    content: string
): UpdateNoteDataThunkAction => (
    dispatch
): void => {

    const fullData = {
        content,
        charCount: content.length,
        wordCount: (() => {
            const matches = content.match(/[\w\d\’\'-]+/gi);
            return matches ? matches.length : 0;
        })()
    }

    dispatch(actions.updateNoteEditorData(fullData));
}

type UpdateNoteDataThunkAction = ThunkAction<void, undefined, unknown, types.NoteEditorDataUpdatedAction>;

/** 
*  Summary:
*  Saves the currently editing Note Model.
*
*  Description
*  Updates any categories it has been added to or removed from.
*  Persists or overwrites the Note depending on its isNew status.
*/

export const saveNoteEditorModel = (): SaveNoteEditorThunkAction => (
    dispatch,
    getState
): void => {
    dispatch(editorOperations.setEditorSaving());

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

    const stamped = editorHelpers.stampContentModel(data.editing);

    if (editor.attributes.isNew) {
        dispatch(noteOperations.createNote(stamped));
    } else {
        dispatch(noteOperations.overwriteNote(stamped));
    }

    const { save } = editor.dialogs;

    if (save.isOpen) {
        dispatch(editorOperations.closeEditor());
    } else {
        dispatch(editorOperations.openEditor("note", data.editing.id));
    }
}

type SaveNoteEditorThunkAction = ThunkAction<void, RootState, unknown, any>;