import { ThunkResult } from '../../../store';

import * as actions from './actions';

import { categoryOperations } from '../categories';

import Note from '../../../../db/models/Note';
import NoteController from '../../../../db/controllers/Note';
import { notificationsOperations } from '../../notifications';

const { notifyDatabaseError } = notificationsOperations;

/** 
*  Summary:
*  Loads the user's Notes into the store from DB.
*/

export const loadNotes = (
    notes: Note[]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.loadNotes(notes));
}

/** 
*  Summary:
*  Saves a single new Note in store and DB.
*
*  @param {object} note The new Note Model.
*/

export const createNote = (
    note: Note
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await NoteController.insertNote(note);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!data) return Promise.reject();

    const { note: insertedNote, updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.createNote(insertedNote));
}

/** 
*  Summary:
*  Saves a single updated Note in store and DB.
*/

export const updateNote = (
    note: Note
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await NoteController.updateNote(note);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!data) return Promise.reject();

    const { note: updatedNote, updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.overwriteNotes([updatedNote]));
}

/** 
*  Summary:
*  Overwrites multiple updated Notes in store according to id.
*
*  @param {array} notes The updated Notes to overwrite with.
*/

export const overwriteNotes = (
    notes: Note[]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.overwriteNotes(notes));
}

/** 
*  Summary:
*  Deletes multiple Notes from store and DB.
*/

export const deleteNotes = (
    ids: string[]
): ThunkResult<Promise<any>> => async (
    dispatch
) => {
    if (ids.length === 0) return Promise.resolve();
    
    const data = await (async () => {
        try {
            return await NoteController.deleteNotes(ids);
        } catch (err) {
            dispatch(notifyDatabaseError(err.message));
        }
    })();

    if (!data) return Promise.reject();
    
    const { updatedCategories } = data;

    if (updatedCategories.length > 0) {
        dispatch(categoryOperations.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.deleteNotes(ids));
}

/** 
*  Summary:
*  Clears notes from the store on user sign out.
*
*/

export const clearNotes = (): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.clearNotes());
}