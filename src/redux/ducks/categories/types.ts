import { CategoryModel } from '../../_data/categoriesData';

export const CATEGORY_CREATED       = "dictm/categories/CATEGORY_CREATED";
export const CATEGORY_OVERWRITTEN   = "dictm/categories/CATEGORY_OVERWRITTEN";
export const CATEGORY_IDS_ADDED     = "dictm/categories/CATEGORY_IDS_ADDED";
export const CATEGORY_IDS_REMOVED   = "dictm/categories/CATEGORY_IDS_REMOVED";
export const CATEGORY_DELETED       = "dictm/categories/CATEGORY_DELETED";

export interface CategoriesState {
    byId: Record<string, CategoryModel>;
    allIds: string[];
}

export interface CategoryCreatedAction {
    type: typeof CATEGORY_CREATED;
    payload: {
        category: CategoryModel;
    }
}

export interface CategoryOverwrittenAction {
    type: typeof CATEGORY_OVERWRITTEN;
    payload: {
        category: CategoryModel;
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
    CategoryCreatedAction |
    CategoryOverwrittenAction |
    CategoryIdsAddedAction |
    CategoryIdsRemovedAction |
    CategoryDeletedAction;