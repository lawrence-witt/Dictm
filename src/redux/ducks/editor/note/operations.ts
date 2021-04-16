import { ThunkAction } from 'redux-thunk';

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