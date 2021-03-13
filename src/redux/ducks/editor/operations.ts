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
*  Otherwise validates contentId and extracts content model before commiting.
*  
*  @param {types.EditorTypes} editorType The type of editor panel which should be opened.
*  @param {string} contentId Either a random string identifying the content or "new".
*
*  @returns {void}
*/

type OpenEditorThunkAction = ThunkAction<void, RootState, unknown, types.EditorOpenedAction>;

export const openEditor = (
    editorType: types.EditorModelTypes,
    contentId?: string
): OpenEditorThunkAction => (
    dispatch, 
    getState
): void => {
    const { user, media, categories } = getState();

    let editorTitle: string;
    let editorModel: types.EditorModels;
    
    if (editorType === "choose" || contentId === "new") {
        const { title, model } = helpers.generateContentModel(editorType, user.id);
        editorTitle = title;
        editorModel = model;
    } else {
        const foundContentModel = helpers.findContentModel(media, categories, editorType, contentId);

        if (!foundContentModel) {
            // TODO: dispatch notification error
            return;
        }

        editorTitle = foundContentModel.title;
        editorModel = foundContentModel;
    }

    // TODO: add editorType and contentId to sessionStorage
    dispatch(actions.openEditor(editorTitle, editorModel));
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