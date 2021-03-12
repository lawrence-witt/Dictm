import {
    EditorState,
    EditorActionTypes,
    EDITOR_OPENED,
    EDITOR_CLOSED
} from './types';

const initialState: EditorState = {
    editorType: undefined,
    contentId: undefined,
    contentModel: undefined
}

const editorReducer = (
    state = initialState,
    action: EditorActionTypes
): EditorState => {
    switch(action.type) {
        case EDITOR_OPENED:
            return {
                editorType: action.payload.editorType,
                contentId: action.payload.contentId,
                contentModel: action.payload.contentModel
            }
        case EDITOR_CLOSED:
            return initialState;
        default:
            return state;
    }
}

export default editorReducer;