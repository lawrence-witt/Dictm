import { ThunkAction } from 'redux-thunk';

import * as types from './types';
import * as actions from './actions';

import Category from '../../../db/models/Category';

/** 
*  Summary:
*  Loads the users categories into the store
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
*  Persists a new Category.
*  
*  Description:
*  Adds the Category to the database.
*  Adds the Category to the store.
*
*  @param {object} category The new Category Model.
*/

export const createCategory = (
    category: Category
): CreateCategoryThunkAction => (
    dispatch
): void => {
    // TODO: create database record
    dispatch(actions.createCategory(category));
}

type CreateCategoryThunkAction = ThunkAction<void, undefined, unknown, types.CategoryCreatedAction>;

/** 
*  Summary:
*  Overwrites a Category.
*
*  Description:
*  Overwrites the Category in the database.
*  Overwrites the Category in the store.
*
*  @param {object} category The updated Category.
*/

export const overwriteCategory = (
    category: Category
): OverwriteCategoryThunkAction => (
    dispatch
): void => {
    // TODO: update database record
    dispatch(actions.overwriteCategory(category));
}

type OverwriteCategoryThunkAction = ThunkAction<void, undefined, unknown, types.CategoryOverwrittenAction>;

/** 
*  Summary:
*  Adds an array of resource ids to a Category.
*
*  Description:
*  Adds the Category ids in the database.
*  Adds the Category ids in the store.
*
*  @param {string} id The id identifying the Category.
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
*  Removes an array of resource ids from a Category.
*
*  Description:
*  Removes the Category ids in the database.
*  Removes the Category ids in the store.
*
*  @param {string} id The id identifying the Category.
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
*  Summary
*  Deletes a Category.
*
*  Description:
*  Deletes the Category from the database.
*  Deletes the Category from the store.
*
*  @param {string} id The id identifying the Category.
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