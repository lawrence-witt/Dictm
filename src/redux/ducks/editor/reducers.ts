import * as types from './types';

import recordingEditorReducer, { recordingTypes } from './recording';
import noteEditorReducer, { noteTypes } from './note';
import categoryEditorReducer, { categoryTypes } from './category';

//  Choose Editor Reducer

const chooseEditorReducer = (
    state: types.ChooseEditorContext | undefined,
    action: types.EditorActionTypes
): types.ChooseEditorContext => {
    if (!state) {
        if (action.type !== types.EDITOR_OPENED) {
            throw new Error('Choose Editor has not been initialised.');
        }
        if (action.payload.context.type !== "choose") {
            throw new Error(`Choose Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    return state;
}

// Base Editor Reducer

const contextReducerMap = {
    choose: chooseEditorReducer,
    recording: recordingEditorReducer,
    note: noteEditorReducer,
    category: categoryEditorReducer
}

const initialEditorState: types.EditorState = {
    attributes: {
        title: "",
        isOpen: false,
        isNew: false,
        isSaving: false
    },
    context: undefined,
    dialogs: {
        save: {
            isOpen: false
        },
        details: {
            isOpen: false
        }
    }
}

const editorReducer = (
    state = initialEditorState,
    action: types.EditorActionTypes
): types.EditorState => {
    switch(action.type) {
        case types.EDITOR_OPENED: {
            const contextReducer = contextReducerMap[action.payload.context.type];

            return {
                ...state,
                attributes: {
                    title: action.payload.title,
                    isOpen: true,
                    isNew: action.payload.isNew,
                    isSaving: false
                },
                context: contextReducer(undefined, action)
            }
        }
        case types.EDITOR_SET_SAVING:
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    isSaving: true
                }
            }
        case types.EDITOR_UNSET_SAVING:
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    isSaving: false
                }
            }
        case types.EDITOR_SAVE_DIALOG_OPENED:
            return {
                ...state,
                dialogs: {
                    ...state.dialogs,
                    save: {
                        isOpen: true
                    }
                }
            }
        case types.EDITOR_DETAILS_DIALOG_OPENED:
            return {
                ...state,
                dialogs: {
                    ...state.dialogs,
                    details: {
                        isOpen: true
                    }
                }
            }
        case types.EDITOR_DIALOG_CLOSED:
            return {
                ...state,
                dialogs: {
                    save: {
                        isOpen: false
                    },
                    details: {
                        isOpen: false
                    }
                }
            }
        case types.EDITOR_CLOSED:
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    isOpen: false
                }
            };
        case types.EDITOR_CLEARED:
            return initialEditorState;
        case recordingTypes.RECORDING_EDITOR_MODE_UPDATED:
        case recordingTypes.RECORDING_EDITOR_TITLE_UPDATED:
        case recordingTypes.RECORDING_EDITOR_CATEGORY_UPDATED:
        case recordingTypes.RECORDING_EDITOR_DATA_UPDATED:
            if (!state.context || state.context.type !== "recording") {
                throw new Error(`Recording Editor action cannot be executed on ${state.context?.type} context.`);
            }

            return {
                ...state,
                context: recordingEditorReducer(state.context, action)
            }
        case noteTypes.NOTE_EDITOR_TITLE_UPDATED:
        case noteTypes.NOTE_EDITOR_CATEGORY_UPDATED:
        case noteTypes.NOTE_EDITOR_DATA_UPDATED:
            if (!state.context || state.context.type !== "note") {
                throw new Error(`Note Editor action cannot be executed on ${state.context?.type} context.`);
            }

            return {
                ...state,
                context: noteEditorReducer(state.context, action)
            }
        case categoryTypes.CATEGORY_EDITOR_TITLE_UPDATED:
        case categoryTypes.CATEGORY_EDITOR_IDS_UPDATED:
            if (!state.context || state.context.type !== "category") {
                throw new Error(`Category Editor action cannot be executed on ${state.context?.type} context.`);
            }

            return {
                ...state,
                context: categoryEditorReducer(state.context, action)
            }
        default:
            return state;
    }
}

export default editorReducer;