import { db } from '../../db';

import { CommonController } from '../Common';

import Recording from '../../models/Recording';
import Category from '../../models/Category';

// SELECT

export const selectRecording = (id: string): Promise<Recording> => {
    return CommonController.selectModelById("recordings", id);
}

export const selectUserRecordings = (userId: string): Promise<Recording[]> => {
    return CommonController.selectModelsByUserId("recordings", userId);
}

// INSERT

export const insertRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.recordings, db.categories, async () => {
        const { id, relationships: { category } } = recording;

        const insertedModel = await CommonController.insertModel("recordings", recording);

        const updatedCategories = category.id ? ([
            await CommonController.updateCategoryMedia(
                'add', category.id, [id], []
            )
        ]) : [];

        return {
            recording: insertedModel,
            updatedCategories
        }
    });
}

// UPDATE

export const updateRecordingCategory = (
    id: string, 
    categoryId: string | undefined
): Promise<Recording> => {
    return CommonController.updateMediaCategory("recordings", id, categoryId);
}

export const updateRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.recordings, db.categories, async () => {
        const { previous, current } = await CommonController.updateModel("recordings", recording);

        const updatedCategories = await (async () => {
            const { id: prevId } = previous.relationships.category;
            const { id: newId } = current.relationships.category;

            const unEqual = prevId !== newId;

            const removed = unEqual && prevId ? ([
                await CommonController.updateCategoryMedia(
                    'remove', prevId, [recording.id], []
                )
            ]) : [];

            const added = unEqual && newId ? ([
                await CommonController.updateCategoryMedia(
                    'add', newId, [recording.id], []
                )
            ]) : [];

            return [...added, ...removed];
        })();

        return {
            recording: current,
            updatedCategories
        }
    });
}

// DELETE

export const deleteRecording = (id: string): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const deleted = await CommonController.deleteModel("recordings", id);

        const categoryId = deleted.relationships.category.id;

        const updatedCategories = categoryId ? (
            [await CommonController.updateCategoryMedia(
                'remove', categoryId, [id], []
            )]
        ) : [];

        return {
            updatedCategories
        };
    });
}

export const deleteRecordings = (ids: string[]): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const updatedCategoryIds: Set<string> = new Set();

        for (const id of ids) {
            const result = await deleteRecording(id);
            result.updatedCategories.forEach(category => updatedCategoryIds.add(category.id));
        }

        const updatedCategories = await (
            db.categories
            .where('id').anyOf(Array.from(updatedCategoryIds))
            .toArray()
        );

        return {
            updatedCategories
        }
    })
}