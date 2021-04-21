import { ThunkResult } from '../../../store';

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
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateNoteEditorTitle(title));
}

/** 
*  Summary
*  Updates the category for a Note Model.
*
*  @param {string | undefined} id The new category (or no category) the model should be assigned to.
*/

export const updateNoteEditorCategory = (
    id?: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateNoteEditorCategory(id));
}

/** 
*  Summary
*  Updates the text data for a Note Model.
*
*  @param {object} content A string containing the content of the note.
*/

export const updateNoteEditorData = (
    content: string
): ThunkResult<void> => (
    dispatch
) => {

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