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
                model: {
                    ...state.model,
                    attributes: {
                        ...state.model.attributes,
                        title: action.payload.title
                    }
                }
            }
        case types.RECORDING_EDITOR_CATEGORY_UPDATED:
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
        case types.RECORDING_EDITOR_ATTRIBUTES_UPDATED:
            return {
                ...state,
                model: {
                    ...state.model,
                    data: {
                        ...state.model.data,
                        audio: {
                            ...state.model.data.audio,
                            attributes: action.payload.attributes
                        }
                    }
                }
            }
        case types.RECORDING_EDITOR_DATA_UPDATED:
            return {
                ...state,
                model: {
                    ...state.model,
                    data: action.payload.data
                }
            }
        case types.RECORDING_EDITOR_SAVING_UPDATED:
            return {
                ...state,
                isSaveRequested: action.payload.saving
            }
        default:
            return state;
    }
}

export default recordingEditorReducer;