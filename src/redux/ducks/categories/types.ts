import Category from '../../../db/models/Category';

export const CATEGORIES_LOADED      = "dictm/categories/CATEGORIES_LOADED";
export const CATEGORY_CREATED       = "dictm/categories/CATEGORY_CREATED";
export const CATEGORY_OVERWRITTEN   = "dictm/categories/CATEGORY_OVERWRITTEN";
export const CATEGORY_IDS_ADDED     = "dictm/categories/CATEGORY_IDS_ADDED";
export const CATEGORY_IDS_REMOVED   = "dictm/categories/CATEGORY_IDS_REMOVED";
export const CATEGORY_DELETED       = "dictm/categories/CATEGORY_DELETED";

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

export interface CategoryOverwrittenAction {
    type: typeof CATEGORY_OVERWRITTEN;
    payload: {
        category: Category;
    }
}

export interface CategoryIdsAddedAction {
    type: typeof CATEGORY_IDS_ADDED;
    payload: {
        id: string;
        type: "recordings" | "notes";
        ids: string[];
    }
}

export interface CategoryIdsRemovedAction {
    type: typeof CATEGORY_IDS_REMOVED;
    payload: {
        id: string;
        type: "recordings" | "notes";
        ids: string[];
    }
}

export interface CategoryDeletedAction {
    type: typeof CATEGORY_DELETED;
    payload: {
        id: string;
    }
}

export type CategoriesActionTypes =
|   CategoriesLoadedAction
|   CategoryCreatedAction
|   CategoryOverwrittenAction
|   CategoryIdsAddedAction
|   CategoryIdsRemovedAction
|   CategoryDeletedAction;