import {
    EditorContexts,
    EDITOR_OPENED,
    EditorOpenedAction,
    EDITOR_CLOSED,
    EditorClosedAction,
    EDITOR_CLEARED,
    EditorClearedAction
} from './types';

/* 
*   Editor Base Actions
*/

export const openEditor = (
    title: string,
    isNew: boolean,
    context: EditorContexts[keyof EditorContexts]
): EditorOpenedAction => ({
    type: EDITOR_OPENED,
    payload: {
        title,
        isNew,
        context
    }
});

export const closeEditor = (): EditorClosedAction => ({
    type: EDITOR_CLOSED
});

export const clearEditor = (): EditorClearedAction => ({
    type: EDITOR_CLEARED
});

/* 
*   Recording Context Actions
*/