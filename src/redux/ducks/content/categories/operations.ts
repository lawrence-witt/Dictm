import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import Category from '../../../../db/models/Category';
import { CategoryController } from '../../../../db/controllers/Category';
import { recordingOperations } from '../recordings';
import { noteOperations } from '../notes';

/** 
*  Summary:
*  Loads the users Categories into the store from DB.
*/

export const loadCategories = (
    categories: Category[]
): LoadCategoriesThunkAction => (
    dispatch
): void => {
    dispatch(actions.loadCategories(categories));
}

type LoadCategoriesThunkAction = ThunkAction<void, undefined, unknown, types.CategoriesLoadedAction>;

/** 
*  Summary:
*  Saves a single new Category in store and DB.
*/

export const createCategory = async (
    category: Category
): Promise<CreateCategoryThunkAction> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await CategoryController.insertCategory(category);
        } catch (err) {
            // handle no category create
            console.log(err);
        }
    })();

    if (!data) return Promise.reject();

    const { 
        category: insertedCategory, 
        updatedRecordings, 
        updatedNotes, 
        updatedCategories 
    } = data;

    if (updatedRecordings.length > 0) {
        dispatch(recordingOperations.overwriteRecordings(updatedRecordings));
    }

    if (updatedNotes.length > 0) {
        dispatch(noteOperations.overwriteNotes(updatedNotes));
    }

    if (updatedCategories.length > 0) {
        dispatch(actions.overwriteCategories(updatedCategories));
    }

    return dispatch(actions.createCategory(insertedCategory));
}

type CreateCategoryThunkAction = ThunkAction<void, undefined, unknown, 
    types.CategoriesOverwrittenAction | 
    types.CategoryCreatedAction
>;

/** 
*  Summary:
*  Saves a single updated Category in store and DB.
*/

export const updateCategory = async (
    category: Category
): Promise<UpdateCategoryThunkAction> => async (
    dispatch
) => {
    const data = await (async () => {
        try {
            return await CategoryController.updateCategory(category);
        } catch (err) {
            // handle no category update
            console.log(err);
        }
    })();

    if (!data) return Promise.reject();

    const {
        updatedRecordings,
        updatedNotes,
        updatedCategories
    } = data;

    if (updatedRecordings.length > 0) {
        dispatch(recordingOperations.overwriteRecordings(updatedRecordings));
    }

    if (updatedNotes.length > 0) {
        dispatch(noteOperations.overwriteNotes(updatedNotes));
    }

    return dispatch(actions.overwriteCategories(updatedCategories));
}

type UpdateCategoryThunkAction = ThunkAction<void, undefined, unknown, types.CategoriesOverwrittenAction>;

/** 
*  Summary:
*  Overwrites multiple updated categories in store accoring to id.
*/

export const overwriteCategories = (
    categories: Category[]
): OverwriteCategoriesThunkAction => (
    dispatch
): void => {
    dispatch(actions.overwriteCategories(categories));
}

type OverwriteCategoriesThunkAction = ThunkAction<void, undefined, unknown, types.CategoriesOverwrittenAction>;

/** 
*  Summary
*  Deletes multiple Categories from store and DB.
*/

export const deleteCategories = (
    ids: string[]
): DeleteCategoriesThunkAction => (
    dispatch
): void => {
    // TODO: remove database records
    dispatch(actions.deleteCategories(ids));
}

type DeleteCategoriesThunkAction = ThunkAction<void, undefined, unknown, types.CategoriesDeletedAction>;

/** 
*  Summary:
*  Clears categories from the store on user sign out.
*
*/

export const clearCategories = (): ClearCategoriesThunkAction => (
    dispatch
): void => {
    dispatch(actions.clearCategories());
}

type ClearCategoriesThunkAction = ThunkAction<void, undefined, unknown, types.CategoriesClearedAction>;