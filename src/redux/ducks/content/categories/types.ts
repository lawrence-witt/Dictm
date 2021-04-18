import Category from '../../../../db/models/Category';

export const CATEGORIES_LOADED      = "dictm/content/categories/CATEGORIES_LOADED";
export const CATEGORY_CREATED       = "dictm/content/categories/CATEGORY_CREATED";
export const CATEGORIES_OVERWRITTEN = "dictm/content/categories/CATEGORIES_OVERWRITTEN";
export const CATEGORIES_DELETED     = "dictm/content/categories/CATEGORIES_DELETED";
export const CATEGORIES_CLEARED     = "dictm/content/categories/CATEGORIES_CLEARED";

export interface CategoriesState {
    byId: Record<string, Category>;
    allIds: string[];
}

export interface CategoriesLoadedAction {
    type: typeof CATEGORIES_LOADED;
    payload: {
        categories: Category[]
    }
}

export interface CategoryCreatedAction {
    type: typeof CATEGORY_CREATED;
    payload: {
        category: Category;
    }
}

export interface CategoriesOverwrittenAction {
    type: typeof CATEGORIES_OVERWRITTEN;
    payload: {
        categories: Category[];
    }
}

export interface CategoriesDeletedAction {
    type: typeof CATEGORIES_DELETED;
    payload: {
        ids: string[];
    }
}

export interface CategoriesClearedAction {
    type: typeof CATEGORIES_CLEARED;
}

export type CategoriesActionTypes =
|   CategoriesLoadedAction
|   CategoryCreatedAction
|   CategoriesOverwrittenAction
|   CategoriesDeletedAction
|   CategoriesClearedAction;