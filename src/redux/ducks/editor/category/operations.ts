import { ThunkResult } from '../../../store';

import * as actions from './actions';
import * as types from './types';

/** 
*  Summary: 
*  Updates the title string for a Category Model.
*
*  @param {string} title The new title for the model.
*/

export const updateCategoryEditorTitle = (
    title: string
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.updateCategoryEditorTitle(title));
}

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
): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.updateCategoryEditorIds(type, ids));
}