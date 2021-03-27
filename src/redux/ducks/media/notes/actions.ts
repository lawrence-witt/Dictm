import * as types from './types';

import { NoteModel } from '../../../_data/notesData';

export const createNote = (
    note: NoteModel
): types.NoteCreatedAction => ({
    type: types.NOTE_CREATED,
    payload: {
        note
    }
});

export const overwriteNote = (
    note: NoteModel
): types.NoteOverwrittenAction => ({
    type: types.NOTE_OVERWRITTEN,
    payload: {
        note
    }
});

export const updateNoteCategory = (
    id: string,
    categoryId: string | undefined
): types.NoteCategoryUpdatedAction => ({
    type: types.NOTE_CATEGORY_UPDATED,
    payload: {
        id,
        categoryId
    }
});

export const deleteNote = (
    id: string
): types.NoteDeletedAction => ({
    type: types.NOTE_DELETED,
    payload: {
        id
    }
});