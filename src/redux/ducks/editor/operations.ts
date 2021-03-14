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
*
*  @returns {void}
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

    // TODO: save editorType and contentId in sessionStorage
    dispatch(actions.openEditor(helpers.generateEditorContext(model, isNew)));
}

/** 
*  Summary 
*  Closes the editor modal.
*
*  Description 
*  Resets the editor base state to undefined.
*  Removes the editorType and contentId from sessionStorage.
*/

type CloseEditorThunkAction = ThunkAction<void, undefined, unknown, types.EditorClosedAction>;

export const closeEditor = (): CloseEditorThunkAction => (
    dispatch
): void => {
    // TODO: remove editorType and contentId in sessionStorage
    dispatch(actions.closeEditor());
} 