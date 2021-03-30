import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import { CategoryModel } from '../../_data/categoriesData';

/** 
*  Summary:
*  Persists a new Category Model.
*  
*  Description:
*  Adds the Category Model to the database.
*  Adds the Category Model to the store.
*
*  @param {object} category The new Category Model.
*/

export const createCategory = (
    category: CategoryModel
): CreateCategoryThunkAction => (
    dispatch
): void => {
    // TODO: create database record
    dispatch(actions.createCategory(category));
}

type CreateCategoryThunkAction = ThunkAction<void, undefined, unknown, types.CategoryCreatedAction>;

/** 
*  Summary:
*  Overwrites a Category Model.
*
*  Description:
*  Overwrites the Category Model in the database.
*  Overwrites the Category Model in the store.
*
*  @param {object} category The updated Category Model.
*/

export const overwriteCategory = (
    category: CategoryModel
): OverwriteCategoryThunkAction => (
    dispatch
): void => {
    // TODO: update database record
    dispatch(actions.overwriteCategory(category));
}

type OverwriteCategoryThunkAction = ThunkAction<void, undefined, unknown, types.CategoryOverwrittenAction>;

/** 
*  Summary:
*  Adds an array of resource ids to a Category Model.
*
*  Description:
*  Adds the Category Model ids in the database.
*  Adds the Category Model ids in the store.
*
*  @param {string} id The id identifying the Category Model.
*  @param {"recording" | "note"} type The resource type of the ids.
*  @param {string[]} ids The array of resource ids.
*/

export const addCategoryIds = (
    id: string,
    type: "recordings" | "notes",
    ids: string[]
): AddCategoryIdsThunkAction => (
    dispatch
): void => {
    // TODO: update database record
    dispatch(actions.addCategoryIds(id, type, ids));
}

type AddCategoryIdsThunkAction = ThunkAction<void, undefined, unknown, types.CategoryIdsAddedAction>;

/** 
*  Summary:
*  Removes an array of resource ids from a Category Model.
*
*  Description:
*  Removes the Category Model ids in the database.
*  Removes the Category Model ids in the store.
*
*  @param {string} id The id identifying the Category Model.
*  @param {"recording" | "note"} type The resource type of the ids.
*  @param {string[]} ids The array of resource ids.
*/

export const removeCategoryIds = (
    id: string,
    type: "recordings" | "notes",
    ids: string[]
): RemoveCategoryIdsThunkAction => (
    dispatch
): void => {
    // TODO: update database record
    dispatch(actions.removeCategoryIds(id, type, ids));
}

type RemoveCategoryIdsThunkAction = ThunkAction<void, undefined, unknown, types.CategoryIdsRemovedAction>;

/** 
*  Summary:
*  Deletes a Category Model.
*
*  Description:
*  Deletes the Category Model from the database.
*  Deletes the Category Model from the store.
*
*  @param {string} id The id identifying the Category Model.
*/

export const deleteCategory = (
    id: string
): DeleteCategoryThunkAction => (
    dispatch
): void => {
    // TODO: remove database record
    dispatch(actions.deleteCategory(id));
}

type DeleteCategoryThunkAction = ThunkAction<void, undefined, unknown, types.CategoryDeletedAction>;