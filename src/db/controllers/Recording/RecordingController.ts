import { db } from '../../db';

import { CommonController } from '../Common';

import Recording from '../../models/Recording';
import Category from '../../models/Category';

interface RecordingAndCategoriesReturn {
    recording: Recording;
    updatedCategories: Category[];
}

type CategoriesReturn = Omit<RecordingAndCategoriesReturn, "recording">;

// SELECT

export const selectRecording = (id: string): Promise<Recording> => {
    return CommonController.selectModelById("recordings", id);
}

export const selectRecordingsById = (ids: string[]): Promise<Recording[]> => {
    return CommonController.selectModelsById("recordings", ids);
}

export const selectRecordingsByUserId = (userId: string): Promise<Recording[]> => {
    return CommonController.selectModelsByUserId("recordings", userId);
}

// INSERT

export const _insertRecording = (
    insertFn: typeof CommonController["insertModel"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"]
) => {
    return (recording: Recording): Promise<RecordingAndCategoriesReturn> => {
        return db.transaction('rw', db.users, db.recordings, db.categories, async () => {
            const { id, relationships: { category } } = recording;
    
            const insertedModel = await insertFn("recordings", recording);
    
            const updatedCategories = category.id ? ([
                await updateCategoryFn('add', category.id, [id], [])
            ]) : [];
    
            return {
                recording: insertedModel,
                updatedCategories
            }
        })
    }
}

export const insertRecording = (
    recording: Recording
): Promise<RecordingAndCategoriesReturn> => {
    return _insertRecording(CommonController.insertModel, CommonController.updateCategoryMedia)(recording)
}

// UPDATE

export const _updateRecording = (
    updateFn: typeof CommonController["updateModel"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"]
) => {
    return (recording: Recording): Promise<RecordingAndCategoriesReturn> => {
        return db.transaction('rw', db.users, db.recordings, db.categories, async () => {
            const { previous, current } = await updateFn("recordings", recording);
    
            const updatedCategories = await (async () => {
                const { id: prevId } = previous.relationships.category;
                const { id: newId } = current.relationships.category;
    
                const unEqual = prevId !== newId;
    
                const removed = unEqual && prevId ? ([
                    await updateCategoryFn('remove', prevId, [recording.id], [])
                ]) : [];
    
                const added = unEqual && newId ? ([
                    await updateCategoryFn('add', newId, [recording.id], [])
                ]) : [];
    
                return [...added, ...removed];
            })();
    
            return {
                recording: current,
                updatedCategories
            }
        });
    }
}

export const updateRecording = (
    recording: Recording
): Promise<RecordingAndCategoriesReturn> => {
    return _updateRecording(CommonController.updateModel, CommonController.updateCategoryMedia)(recording);
}

// DELETE

export const _deleteRecording = (
    deleteFn: typeof CommonController["deleteModel"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"]
) => {
    return (id: string): Promise<CategoriesReturn> => {
        return db.transaction('rw', db.recordings, db.categories, async () => {
            const deleted = await deleteFn("recordings", id);
    
            const categoryId = deleted.relationships.category.id;
    
            const updatedCategories = categoryId ? (
                [await updateCategoryFn('remove', categoryId, [id], [])]
            ) : [];
    
            return {
                updatedCategories
            };
        });
    }
}

export const deleteRecording = (
    id: string
): Promise<CategoriesReturn> => {
    return _deleteRecording(CommonController.deleteModel, CommonController.updateCategoryMedia)(id);
}

export const _deleteRecordings = (
    deleteFn: typeof deleteRecording,
    selectFn: typeof CommonController["selectModelsById"]
) => {
    return (ids: string[]): Promise<CategoriesReturn> => {
        return db.transaction('rw', db.recordings, db.categories, async () => {
            const updatedCategoryIds: Set<string> = new Set();
    
            for (const id of ids) {
                const result = await deleteFn(id);
                result.updatedCategories.forEach(category => updatedCategoryIds.add(category.id));
            }
    
            const updatedCategories = updatedCategoryIds.size > 0 ? (
                await selectFn("categories", Array.from(updatedCategoryIds))
            ) : [];
    
            return {
                updatedCategories
            }
        })
    }
}

export const deleteRecordings = (
    ids: string[]
): Promise<CategoriesReturn> => {
    return _deleteRecordings(deleteRecording, CommonController.selectModelsById)(ids);
}