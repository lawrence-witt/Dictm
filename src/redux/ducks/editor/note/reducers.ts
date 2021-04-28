import * as editorTypes from '../types';
import * as types from './types'

const noteEditorReducer = (
    state: types.NoteEditorContext | undefined,
    action: types.NoteEditorActionTypes
): types.NoteEditorContext => {
    if (!state) {
        if (action.type !== editorTypes.EDITOR_OPENED) {
            throw new Error('Note Editor has not been initialised.');
        }
        if (action.payload.context.type !== "note") {
            throw new Error(`Note Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    switch (action.type) {
        case types.NOTE_EDITOR_TITLE_UPDATED:
            return {
                ...state,
                model: {
                    ...state.model,
                    attributes: {
                        ...state.model.attributes,
                        title: action.payload.title
                    }
                }
            }
        case types.NOTE_EDITOR_CATEGORY_UPDATED:
            return {
                ...state,
                model: {
                    ...state.model,
                    relationships: {
                        ...state.model.relationships,
                        category: {
                            id: action.payload.id
                        }
                    }
                }
            }
        case types.NOTE_EDITOR_DATA_UPDATED:
            return {
                ...state,
                model: {
                    ...state.model,
                    data: action.payload.data
                }
            }
        default:
            return state;
    }
}

export default noteEditorReducer;