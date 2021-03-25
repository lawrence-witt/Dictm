import {
    EditorContexts,
    EditorState,

    RecordingEditorActionTypes,
    NoteEditorActionTypes,
    CategoryEditorActionTypes,
    EditorActionTypes,

    EDITOR_OPENED,
    EDITOR_CLOSED,
    EDITOR_CLEARED,

    RECORDING_EDITOR_MODE_UPDATED,
    RECORDING_EDITOR_TITLE_UPDATED,
    RECORDING_EDITOR_CATEGORY_UPDATED,
    RECORDING_EDITOR_DATA_UPDATED,

    NOTE_EDITOR_TITLE_UPDATED,
    NOTE_EDITOR_CATEGORY_UPDATED,
    NOTE_EDITOR_DATA_UPDATED,

    CATEGORY_EDITOR_TITLE_UPDATED,
    CATEGORY_EDITOR_ID_ADDED,
    CATEGORY_EDITOR_ID_REMOVED
} from './types';

//  Choose Editor Reducer

const chooseEditorReducer = (
    state: EditorContexts["choose"] | undefined,
    action: EditorActionTypes
): EditorContexts["choose"] => {
    if (!state) {
        if (action.type !== EDITOR_OPENED) {
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
    state: EditorContexts["recording"] | undefined,
    action: RecordingEditorActionTypes
): EditorContexts["recording"] => {
    if (!state) {
        if (action.type !== EDITOR_OPENED) {
            throw new Error('Recording Editor has not been initialised.');
        }
        if (action.payload.context.type !== "recording") {
            throw new Error(`Recording Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    switch (action.type) {
        case RECORDING_EDITOR_MODE_UPDATED:
        case RECORDING_EDITOR_TITLE_UPDATED:
        case RECORDING_EDITOR_CATEGORY_UPDATED:
        case RECORDING_EDITOR_DATA_UPDATED:
        default:
            return state;
    }
}

// Note Editor Reducer

const noteEditorReducer = (
    state: EditorContexts["note"] | undefined,
    action: NoteEditorActionTypes
): EditorContexts["note"] => {
    if (!state) {
        if (action.type !== EDITOR_OPENED) {
            throw new Error('Note Editor has not been initialised.');
        }
        if (action.payload.context.type !== "note") {
            throw new Error(`Note Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    switch (action.type) {
        case NOTE_EDITOR_TITLE_UPDATED:
        case NOTE_EDITOR_CATEGORY_UPDATED:
        case NOTE_EDITOR_DATA_UPDATED:
        default:
            return state;
    }
}

// Category Editor Reducer

const categoryEditorReducer = (
    state: EditorContexts["category"] | undefined,
    action: CategoryEditorActionTypes
): EditorContexts["category"] => {
    if (!state) {
        if (action.type !== EDITOR_OPENED) {
            throw new Error('Category Editor has not been initialised.');
        }
        if (action.payload.context.type !== "category") {
            throw new Error(`Category Editor incorrectly provided ${action.payload.context.type} context.`);
        }

        return action.payload.context;
    }

    switch (action.type) {
        case CATEGORY_EDITOR_TITLE_UPDATED:
        case CATEGORY_EDITOR_ID_ADDED:
        case CATEGORY_EDITOR_ID_REMOVED:
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

const initialEditorState: EditorState = {
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
    action: EditorActionTypes
): EditorState => {
    switch(action.type) {
        case EDITOR_OPENED: {
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
        case EDITOR_CLOSED:
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    isOpen: false
                }
            };
        case EDITOR_CLEARED:
            return initialEditorState;
        case RECORDING_EDITOR_MODE_UPDATED:
        case RECORDING_EDITOR_TITLE_UPDATED:
        case RECORDING_EDITOR_CATEGORY_UPDATED:
        case RECORDING_EDITOR_MODE_UPDATED:
            if (!state.context) throw new Error('Editor has not been provided with a context.');
            if (state.context.type !== "recording") {
                throw new Error(`Recording Editor action cannot be executed on ${state.context.type} context.`);
            }

            return {
                ...state,
                context: recordingEditorReducer(state.context, action)
            }
        case NOTE_EDITOR_TITLE_UPDATED:
        case NOTE_EDITOR_CATEGORY_UPDATED:
        case NOTE_EDITOR_DATA_UPDATED:
            if (!state.context) throw new Error('Editor has not been provided with a context.');
            if (state.context.type !== "note") {
                throw new Error(`Note Editor action cannot be executed on ${state.context.type} context.`);
            }

            return {
                ...state,
                context: noteEditorReducer(state.context, action)
            }
        case CATEGORY_EDITOR_TITLE_UPDATED:
        case CATEGORY_EDITOR_ID_ADDED:
        case CATEGORY_EDITOR_ID_REMOVED:
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