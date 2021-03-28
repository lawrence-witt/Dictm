import { CategoryModel } from '../../../_data/categoriesData';

import { EditorContext, EditorOpenedAction } from '../types';

export const CATEGORY_EDITOR_TITLE_UPDATED      = "dictm/editor/category/CATEGORY_TITLE_UPDATED";
export const CATEGORY_EDITOR_IDS_UPDATED        = "dictm/editor/category/CATEGORY_IDS_UPDATED";

export type CategoryEditorContext = EditorContext<CategoryModel>;

export interface CategoryEditorTitleUpdatedAction {
    type: typeof CATEGORY_EDITOR_TITLE_UPDATED;
    payload: {
        title: string;
    }
}

export interface CategoryEditorIdsUpdatedAction {
    type: typeof CATEGORY_EDITOR_IDS_UPDATED;
    payload: {
        type: "recordings" | "notes";
        ids: string[];
    }
}

export type CategoryEditorActionTypes =
    EditorOpenedAction |
    CategoryEditorTitleUpdatedAction |
    CategoryEditorIdsUpdatedAction;