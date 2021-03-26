import * as types from './types';

//  Choose Editor Reducer

const chooseEditorReducer = (
    state: types.EditorContexts["choose"] | undefined,
    action: types.EditorActionTypes
): types.EditorContexts["choose"] => {
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

// Recording Editor Reducer

const recordingEditorReducer = (
    state: types.EditorContexts["recording"] | undefined,
    action: types.RecordingEditorActionTypes
): types.EditorContexts["recording"] => {
    if (!state) {
        if (action.type !== types.EDITOR_OPENED) {
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
            const id = action.payload.id;
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        relationships: {
                            ...state.data.editing.relationships,
                            category: id === undefined ? id : { id }
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

// Note Editor Reducer

const noteEditorReducer = (
    state: types.EditorContexts["note"] | undefined,
    action: types.NoteEditorActionTypes
): types.EditorContexts["note"] => {
    if (!state) {
        if (action.type !== types.EDITOR_OPENED) {
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
        case types.NOTE_EDITOR_CATEGORY_UPDATED:
            const id = action.payload.id;
            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        relationships: {
                            ...state.data.editing.relationships,
                            category: id === undefined ? id : { id }
                        }
                    }
                }
            }
        case types.NOTE_EDITOR_DATA_UPDATED:
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

// Category Editor Reducer

const categoryEditorReducer = (
    state: types.EditorContexts["category"] | undefined,
    action: types.CategoryEditorActionTypes
): types.EditorContexts["category"] => {
    if (!state) {
        if (action.type !== types.EDITOR_OPENED) {
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
        case types.CATEGORY_EDITOR_ID_ADDED: {
            const resourceType = action.payload.type === "recording" ? "recordings" : "notes";

            const oldRelationships = state.data.editing.relationships;
            const newRelationships = {
                ...oldRelationships,
                [resourceType]: {
                    ids: [...oldRelationships[resourceType].ids, action.payload.id]
                }
            }

            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        relationships: newRelationships
                    }
                }
            }
        }
        case types.CATEGORY_EDITOR_ID_REMOVED: {
            const resourceType = action.payload.type === "recording" ? "recordings" : "notes";

            const oldRelationships = state.data.editing.relationships;
            const newRelationships = {
                ...oldRelationships,
                [resourceType]: {
                    ids: oldRelationships[resourceType].ids.filter(id => id !== action.payload.id)
                }
            }

            return {
                ...state,
                data: {
                    ...state.data,
                    editing: {
                        ...state.data.editing,
                        relationships: newRelationships
                    }
                }
            }
        }
        default:
            return state;
    }
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
        isNew: false
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
            if (state.context) throw new Error('Editor already has a context in state.')

            const contextReducer = contextReducerMap[action.payload.context.type];

            return {
                ...state,
                attributes: {
                    title: action.payload.title,
                    isOpen: true,
                    isNew: action.payload.isNew,
                },
                context: contextReducer(state.context, action)
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
        case types.RECORDING_EDITOR_MODE_UPDATED:
        case types.RECORDING_EDITOR_TITLE_UPDATED:
        case types.RECORDING_EDITOR_CATEGORY_UPDATED:
        case types.RECORDING_EDITOR_DATA_UPDATED:
            if (!state.context) throw new Error('Editor has not been provided with a context.');
            if (state.context.type !== "recording") {
                throw new Error(`Recording Editor action cannot be executed on ${state.context.type} context.`);
            }

            return {
                ...state,
                context: recordingEditorReducer(state.context, action)
            }
        case types.NOTE_EDITOR_TITLE_UPDATED:
        case types.NOTE_EDITOR_CATEGORY_UPDATED:
        case types.NOTE_EDITOR_DATA_UPDATED:
            if (!state.context) throw new Error('Editor has not been provided with a context.');
            if (state.context.type !== "note") {
                throw new Error(`Note Editor action cannot be executed on ${state.context.type} context.`);
            }

            return {
                ...state,
                context: noteEditorReducer(state.context, action)
            }
        case types.CATEGORY_EDITOR_TITLE_UPDATED:
        case types.CATEGORY_EDITOR_ID_ADDED:
        case types.CATEGORY_EDITOR_ID_REMOVED:
            if (!state.context) throw new Error('Editor has not been provided with a context.');
            if (state.context.type !== "category") {
                throw new Error(`Category Editor action cannot be executed on ${state.context.type} context.`);
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