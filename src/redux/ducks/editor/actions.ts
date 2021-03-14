import {
    EditorContexts,
    EDITOR_OPENED,
    EditorOpenedAction,
    EDITOR_CLOSED,
    EditorClosedAction
} from './types';

export const openEditor = (
    context: EditorContexts[keyof EditorContexts]
): EditorOpenedAction => ({
    type: EDITOR_OPENED,
    payload: {
        context
    }
});

export const closeEditor = (): EditorClosedAction => ({
    type: EDITOR_CLOSED
})