import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import { categoryOperations } from '../categories';

import Note from '../../../../db/models/Note';
import { NoteController } from '../../../../db/controllers/Note';

/** 
*  Summary:
*  Loads the user's Notes into the store from DB.
*/

export const loadNotes = (
    notes: Note[]
): NotesLoadedThunkAction => (
    dispatch
): void => {
    dispatch(actions.loadNotes(notes));
}

type NotesLoadedThunkAction = ThunkAction<void, undefined, unknown, types.NotesLoadedAction>;

/** 
*  Summary:
*  Saves a single new Note in store and DB.
*
*  @param {object} note The new Note Model.
*/

export const createNote = async (
    note: Note
): Promise<CreateNoteThunkAction> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await NoteController.insertNote(note);
        } catch (err) {
            // handle no note creation
            console.log(err);
        }
    })();

    if (!data) return Promise.reject();

    const { note: insertedNote, updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.createNote(insertedNote));
}

type CreateNoteThunkAction = ThunkAction<void, undefined, unknown, types.NoteCreatedAction>;

/** 
*  Summary:
*  Saves a single updated Note in store and DB.
*/

export const updateNote = async (
    note: Note
): Promise<UpdateNoteThunkAction> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await NoteController.updateNote(note);
        } catch (err) {
            // handle no note update
            console.log(err);
        }
    })();

    if (!data) return Promise.reject();

    const { note: updatedNote, updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.overwriteNotes([updatedNote]));
}

type UpdateNoteThunkAction = ThunkAction<void, undefined, unknown, types.NotesOverwrittenAction>;

/** 
*  Summary:
*  Overwrites multiple updated Notes in store according to id.
*
*  @param {array} notes The updated Notes to overwrite with.
*/

export const overwriteNotes = (
    notes: Note[]
): OverwriteNotesThunkAction => (
    dispatch
): void => {
    dispatch(actions.overwriteNotes(notes));
}

type OverwriteNotesThunkAction = ThunkAction<void, undefined, unknown, types.NotesOverwrittenAction>;

/** 
*  Summary:
*  Deletes multiple Notes from store and DB.
*/

export const deleteNotes = (
    ids: string[]
): DeleteNoteThunkAction => (
    dispatch
): void => {
    // TODO: remove database record
    dispatch(actions.deleteNotes(ids));
}

type DeleteNoteThunkAction = ThunkAction<void, undefined, unknown, types.NotesDeletedAction>;