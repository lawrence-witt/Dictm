import * as editorTypes from '../types';
import * as types from './types';

const categoryEditorReducer = (
    state: types.CategoryEditorContext | undefined,
    action: types.CategoryEditorActionTypes
): types.CategoryEditorContext => {
    if (!state) {
        if (action.type !== editorTypes.EDITOR_OPENED) {
            throw new Error('Category Editor has not been initialised.');
        }
        if (action.payload.context.type !== "category") {
            throw new Error(`Category Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    switch (action.type) {
        case types.CATEGORY_EDITOR_TITLE_UPDATED:
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        attributes: {
                            ...state.data.editing.attributes,
                            title: action.payload.title
                        }
                    }
                }
            }
        case types.CATEGORY_EDITOR_IDS_UPDATED:
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        relationships: {
                            ...state.data.editing.relationships,
                            [action.payload.type]: {
                                ids: action.payload.ids
                            }
                        }
                    }
                }
            }
        default:
            return state;
    }
}

export default categoryEditorReducer;