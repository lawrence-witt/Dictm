import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import { RootState } from '../../store';

/** 
*  Summary 
*  Opens the editor modal.
*
*  Description 
*  Validates the contentId parameter before allowing the editor modal to open.
*  Adds the base editor state to sessionStorage to enable page reloading.
*  
*  @param {types.EditorType} editorType The type of editor panel which should be opened.
*  @param {string} contentId Either a random string identifying the content or "new".
*
*  @returns {void}
*/

type OpenEditorThunkAction = ThunkAction<void, RootState, unknown, types.EditorOpenedAction>;

export const openEditor = (
    editorType: types.EditorType,
    contentId?: string
): OpenEditorThunkAction => (
    dispatch, 
    getState
): void => {
    const contentModel = (() => {
        if (!contentId || contentId === "new") return undefined;

        const { media, categories } = getState();

        switch (editorType) {
            case "recording":
                return media.recordings.byId[contentId];
            case "note":
                return media.notes.byId[contentId];
            case "category":
                return categories.byId[contentId];
            default:
                return undefined;
        }
    })();

    if (contentId && contentId !== "new" && !contentModel) {
        // dispatch a notification error
    } else {
        // set editorType and contentId in sessionStorage
        dispatch(actions.openEditor(editorType, contentId, contentModel));
    }
}

/** 
*  Summary 
*  Closes the editor modal.
*
*  Description 
*  Reset the editor base state to undefined.
*  Remove the base editor state from sessionStorage.
*/

type CloseEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClosedAction>;

export const closeEditor = (): CloseEditorThunkAction => (
    dispatch
): void => {
    // remove editorType and contentId in sessionStorage
    dispatch(actions.closeEditor());
} 