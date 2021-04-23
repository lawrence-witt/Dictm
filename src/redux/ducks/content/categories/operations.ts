import * as actions from './actions';

import Category from '../../../../db/models/Category';
import { CategoryController } from '../../../../db/controllers/Category';
import { recordingOperations } from '../recordings';
import { noteOperations } from '../notes';
import { ThunkResult } from '../../../store';

/** 
*  Summary:
*  Loads the users Categories into the store from DB.
*/

export const loadCategories = (
    categories: Category[]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.loadCategories(categories));
}

/** 
*  Summary:
*  Saves a single new Category in store and DB.
*/

export const createCategory = (
    category: Category
): ThunkResult<Promise<any>> => async (
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

    dispatch(actions.createCategory(insertedCategory));

    if (updatedRecordings.length > 0) {
        dispatch(recordingOperations.overwriteRecordings(updatedRecordings));
    }

    if (updatedNotes.length > 0) {
        dispatch(noteOperations.overwriteNotes(updatedNotes));
    }

    if (updatedCategories.length > 0) {
        dispatch(actions.overwriteCategories(updatedCategories));
    }
}

/** 
*  Summary:
*  Saves a single updated Category in store and DB.
*/

export const updateCategory = (
    category: Category
): ThunkResult<Promise<any>> => async (
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

    dispatch(actions.overwriteCategories(updatedCategories));

    if (updatedRecordings.length > 0) {
        dispatch(recordingOperations.overwriteRecordings(updatedRecordings));
    }

    if (updatedNotes.length > 0) {
        dispatch(noteOperations.overwriteNotes(updatedNotes));
    }
}

/** 
*  Summary:
*  Overwrites multiple updated categories in store accoring to id.
*/

export const overwriteCategories = (
    categories: Category[]
): ThunkResult<void> => (
    dispatch
) => {
    dispatch(actions.overwriteCategories(categories));
}

/** 
*  Summary
*  Deletes multiple Categories from store and DB.
*/

export const deleteCategories = (
    ids: string[]
): ThunkResult<Promise<void>> => async (
    dispatch
) => {
    if (ids.length === 0) return Promise.resolve();
    
    const data = await (async () => {
        try {
            return await CategoryController.deleteCategories(ids);
        } catch (err) {
            // handle no categories delete
            console.log(err);
        }
    })();

    if (!data) return Promise.reject()
    
    const { updatedRecordings, updatedNotes } = data;

    dispatch(actions.deleteCategories(ids));

    if (updatedRecordings.length > 0) {
        dispatch(recordingOperations.overwriteRecordings(updatedRecordings));
    }

    if (updatedNotes.length > 0) {
        dispatch(noteOperations.overwriteNotes(updatedNotes));
    }
}

/** 
*  Summary:
*  Clears categories from the store on user sign out.
*
*/

export const clearCategories = (): ThunkResult<void> => (
    dispatch
): void => {
    dispatch(actions.clearCategories());
}