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

export const overwriteNotes = (
    notes: Note[]
): types.NotesOverwrittenAction => ({
    type: types.NOTES_OVERWRITTEN,
    payload: {
        notes
    }
});

export const deleteNotes = (
    ids: string[]
): types.NotesDeletedAction => ({
    type: types.NOTES_DELETED,
    payload: {
        ids
    }
});

export const clearNotes = (): types.NotesClearedAction => ({
    type: types.NOTES_CLEARED
});