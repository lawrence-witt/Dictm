import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';
import * as helpers from './helpers';

import { RootState } from '../../store';

/** 
*  Summary 
*  Opens the editor modal.
*
*  Description 
*  Generates a new content model to match editorType if the contentId is "new".
*  Validates model was created or found, and generates an editor context.
*  Saves the editorType and contentId to sessionStorage to facilitate page reloading.
*  
*  @param {types.EditorTypes} editorType The type of editor panel which should be opened.
*  @param {string} contentId Either a random string identifying the content or "new".
*/

type OpenEditorThunkAction = ThunkAction<void, RootState, unknown, types.EditorOpenedAction>;

export const openEditor = (
    editorType: types.EditorModelTypes,
    contentId: string
): OpenEditorThunkAction => (
    dispatch, 
    getState
): void => {
    const { user, media, categories } = getState();

    const isNew = contentId === "new";
    let model: types.EditorModels | undefined;

    if (editorType === "choose" || isNew) {
        model = helpers.generateContentModel(editorType, user.id);
    } else {
        model = helpers.findContentModel(media, categories, editorType, contentId);
    }

    if (!model) {
        // TODO: dispatch notification error
        return;
    }
    
    const { title, context } = helpers.generateEditorContext(model, isNew);

    // TODO: save editorType and contentId in sessionStorage
    dispatch(actions.openEditor(title, isNew, context));
}

/** 
*  Summary 
*  Closes the editor modal.
*
*  Description 
*  Sets the editor isOpen state to false.
*/

type CloseEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClosedAction>;

export const closeEditor = (): CloseEditorThunkAction => (
    dispatch
): void => {
    dispatch(actions.closeEditor());
}

/** 
*  Summary
*  Clears the editor modal.
*
*  Description
*  Resets the editor to its initialState.
*  Removes the editorType and contentId from sessionStorage.
*/

type ClearEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClearedAction>;

export const clearEditor = (): ClearEditorThunkAction => (
    dispatch
): void => {
    // TODO: remove editorType and contentId in sessionStorage
    dispatch(actions.clearEditor());
}