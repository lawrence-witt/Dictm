import {
    EditorState,
    EditorActionTypes,
    EDITOR_OPENED,
    EDITOR_CLOSED
} from './types';

const initialState: EditorState = {
    isOpen: false,
    context: undefined
}

const editorReducer = (
    state = initialState,
    action: EditorActionTypes
): EditorState => {
    switch(action.type) {
        case EDITOR_OPENED:
            return {
                isOpen: true,
                context: action.payload.context
            }
        case EDITOR_CLOSED:
            return initialState;
        default:
            return state;
    }
}

export default editorReducer;