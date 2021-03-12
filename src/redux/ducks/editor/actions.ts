import {
    EditorType,
    ContentModels,
    EDITOR_OPENED,
    EditorOpenedAction,
    EDITOR_CLOSED,
    EditorClosedAction
} from './types';

export const openEditor = (
    editorType: EditorType,
    contentId?: string,
    contentModel?: ContentModels
): EditorOpenedAction => ({
    type: EDITOR_OPENED,
    payload: {
        editorType,
        contentId,
        contentModel
    }
});

export const closeEditor = (): EditorClosedAction => ({
    type: EDITOR_CLOSED
})