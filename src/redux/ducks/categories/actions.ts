import * as types from './types';

import { CategoryModel } from '../../_data/categoriesData';

export const createCategory = (
    category: CategoryModel
): types.CategoryCreatedAction => ({
    type: types.CATEGORY_CREATED,
    payload: {
        category
    }
});

export const overwriteCategory = (
    category: CategoryModel
): types.CategoryOverwrittenAction => ({
    type: types.CATEGORY_OVERWRITTEN,
    payload: {
        category
    }
});

export const addCategoryIds = (
    id: string,
    type: "recordings" | "notes",
    ids: string[]
): types.CategoryIdsAddedAction => ({
    type: types.CATEGORY_IDS_ADDED,
    payload: {
        id,
        type,
        ids
    }
});

export const removeCategoryIds = (
    id: string,
    type: "recordings" | "notes",
    ids: string[]
): types.CategoryIdsRemovedAction => ({
    type: types.CATEGORY_IDS_REMOVED,
    payload: {
        id,
        type,
        ids
    }
});

export const deleteCategory = (
    id: string
): types.CategoryDeletedAction => ({
    type: types.CATEGORY_DELETED,
    payload: {
        id
    }
});