import * as types from './types';

export const updateCategoryEditorTitle = (
    title: string
): types.CategoryEditorTitleUpdatedAction => ({
    type: types.CATEGORY_EDITOR_TITLE_UPDATED,
    payload: {
        title
    }
});

export const updateCategoryEditorIds = (
    type: "recordings" | "notes",
    ids: string[]
): types.CategoryEditorIdsUpdatedAction => ({
    type: types.CATEGORY_EDITOR_IDS_UPDATED,
    payload: {
        type,
        ids
    }
});