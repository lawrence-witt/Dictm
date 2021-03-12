import { CategoryModel } from '../../_data/categoriesData';

export const CATEGORY_ADDED = "dictm/notes/CATEGORY_ADDED";

export interface CategoriesState {
    byId: Record<string, CategoryModel>;
    allIds: string[];
}

interface CategoryAddedAction {
    type: typeof CATEGORY_ADDED;
    payload: {
        category: CategoryModel;
    }
}

export type CategoriesActionTypes = CategoryAddedAction;