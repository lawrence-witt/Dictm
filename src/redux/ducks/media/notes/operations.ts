import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import { NoteModel } from '../../../_data/notesData';

/** 
*  Summary:
*  Persists a new Note Model.
*
*  Description:
*  Adds the Note Model to the database.
*  Adds the Note Model to the store.
*
*  @param {object} note The new Note Model.
*/

export const createNote = (
    note: NoteModel
): CreateNoteThunkAction => (
    dispatch
): void => {
    // TODO: add to database
    dispatch(actions.createNote(note));
}

type CreateNoteThunkAction = ThunkAction<void, undefined, unknown, types.NoteCreatedAction>;

/** 
*  Summary:
*  Overwrites a Note Model.
*
*  Description:
*  Updates the Note Model in the database.
*  Updates the Note Model in the store.
*
*  @param {object} note The updated Note Model.
*/

export const overwriteNote = (
    note: NoteModel
): OverwriteNoteThunkAction => (
    dispatch
): void => {
    // TODO: update in database
    dispatch(actions.overwriteNote(note));
}

type OverwriteNoteThunkAction = ThunkAction<void, undefined, unknown, types.NoteOverwrittenAction>;

/** 
*  Summary:
*  Updates the category of a Note Model.
*
*  Description:
*  Updates the category in the database.
*  Updates the category in the store.
*
*  @param {string} id The id identifying the Note Model.
*  @param {string | undefined} categoryId The id (or undefined) identifying the new category.
*/

export const updateNoteCategory = (
    id: string,
    categoryId: string | undefined
): UpdateNoteCategoryThunkAction => (
    dispatch
): void => {
    dispatch(actions.updateNoteCategory(id, categoryId));
}

type UpdateNoteCategoryThunkAction = ThunkAction<void, undefined, unknown, types.NoteCategoryUpdatedAction>;

/** 
*  Summary:
*  Deletes a Note Model.
*
*  Description:
*  Deletes the Note Model from the database.
*  Deletes the Note Model from the store.
*
*  @param {string} id The id identifying the Note Model.
*/

export const deleteNote = (
    id: string
): DeleteNoteThunkAction => (
    dispatch
): void => {
    // TODO: remove database record
    dispatch(actions.deleteNote(id));
}

type DeleteNoteThunkAction = ThunkAction<void, undefined, unknown, types.NoteDeletedAction>;