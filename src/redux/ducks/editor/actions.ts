import {
    EditorModels,
    EDITOR_OPENED,
    EditorOpenedAction,
    EDITOR_CLOSED,
    EditorClosedAction
} from './types';

export const openEditor = (
    editorTitle: string,
    contentModel: EditorModels
): EditorOpenedAction => ({
    type: EDITOR_OPENED,
    payload: {
        editorTitle,
        contentModel
    }
});

export const closeEditor = (): EditorClosedAction => ({
    type: EDITOR_CLOSED
})