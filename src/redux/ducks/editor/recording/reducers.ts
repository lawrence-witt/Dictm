import * as editorTypes from '../types';
import * as types from './types';

const recordingEditorReducer = (
    state: types.RecordingEditorContext | undefined,
    action: types.RecordingEditorActionTypes
): types.RecordingEditorContext => {
    if (!state) {
        if (action.type !== editorTypes.EDITOR_OPENED) {
            throw new Error('Recording Editor has not been initialised.');
        }
        if (action.payload.context.type !== "recording") {
            throw new Error(`Recording Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    switch (action.type) {
        case types.RECORDING_EDITOR_MODE_UPDATED:
            return {
                ...state,
                mode: action.payload.mode
            }
        case types.RECORDING_EDITOR_TITLE_UPDATED:
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
        case types.RECORDING_EDITOR_CATEGORY_UPDATED:
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        relationships: {
                            ...state.data.editing.relationships,
                            category: { id: action.payload.id }
                        }
                    }
                }
            }
        case types.RECORDING_EDITOR_ATTRIBUTES_UPDATED:
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        data: {
                            ...state.data.editing.data,
                            audio: {
                                ...state.data.editing.data.audio,
                                attributes: action.payload.attributes
                            }
                        }
                    }
                }
            }
        case types.RECORDING_EDITOR_DATA_UPDATED:
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        data: action.payload.data
                    }
                }
            }
        default:
            return state;
    }
}

export default recordingEditorReducer;