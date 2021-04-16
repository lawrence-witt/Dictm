import * as types from './types';

import Note from '../../../../db/models/Note';

export const loadNotes = (
    notes: Note[]
): types.NotesLoadedAction => ({
    type: types.NOTES_LOADED,
    payload: {
        notes
    }
});

export const createNote = (
    note: Note
): types.NoteCreatedAction => ({
    type: types.NOTE_CREATED,
    payload: {
        note
    }
});

export const overwriteNote = (
    note: Note
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