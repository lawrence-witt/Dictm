import {
    EditorState,
    EditorActionTypes,
    EDITOR_OPENED,
    EDITOR_CLOSED
} from './types';

const initialState: EditorState = {
    editorTitle: "",
    contentModel: undefined
}

const editorReducer = (
    state = initialState,
    action: EditorActionTypes
): EditorState => {
    switch(action.type) {
        case EDITOR_OPENED:
            return {
                editorTitle: action.payload.editorTitle,
                contentModel: action.payload.contentModel
            }
        case EDITOR_CLOSED:
            return initialState;
        default:
            return state;
    }
}

export default editorReducer;