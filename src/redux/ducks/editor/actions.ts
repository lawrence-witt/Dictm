import * as types from './types';

export const openEditor = (
    title: string,
    isNew: boolean,
    context: types.EditorContexts[keyof types.EditorContexts]
): types.EditorOpenedAction => ({
    type: types.EDITOR_OPENED,
    payload: {
        title,
        isNew,
        context
    }
});

export const setEditorSaving = (): types.EditorSetSavingAction => ({
    type: types.EDITOR_SET_SAVING
});

export const unsetEditorSaving = (): types.EditorUnsetSavingAction => ({
    type: types.EDITOR_UNSET_SAVING
});

export const closeEditor = (): types.EditorClosedAction => ({
    type: types.EDITOR_CLOSED
});

export const clearEditor = (): types.EditorClearedAction => ({
    type: types.EDITOR_CLEARED
});