import * as types from './types';

import Category from '../../../../db/models/Category';

export const loadCategories = (
    categories: Category[]
): types.CategoriesLoadedAction => ({
    type: types.CATEGORIES_LOADED,
    payload: {
        categories
    }
})

export const createCategory = (
    category: Category
): types.CategoryCreatedAction => ({
    type: types.CATEGORY_CREATED,
    payload: {
        category
    }
});

export const overwriteCategories = (
    categories: Category[]
): types.CategoriesOverwrittenAction => ({
    type: types.CATEGORIES_OVERWRITTEN,
    payload: {
        categories
    }
});

export const deleteCategories = (
    ids: string[]
): types.CategoriesDeletedAction => ({
    type: types.CATEGORIES_DELETED,
    payload: {
        ids
    }
});