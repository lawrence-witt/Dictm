import { db } from '../../db';

import Category from '../../models/Category';
import { CategoryController } from '../Category';

import Recording from '../../models/Recording';

// SELECT

export const selectRecording = async (id: string): Promise<Recording> => {
    const recording = await db.recordings.get(id);
    if (!recording) throw new Error('Note could not be retrieved.');
    return recording;
}

export const selectUserRecordings = (userId: string): Promise<Recording[]> => {
    return db.transaction("r", db.users, db.recordings, async () => {
        const user = await db.users.get(userId);
        if (!user) throw new Error("User could not be retrieved.");
        return db.recordings.where({"relationships.user.id": userId}).toArray();
    });
}

// INSERT

export const insertRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const { id, relationships: { category } } = recording;

        const updatedCategories = category.id ? ([
            await CategoryController.updateCategoryRelationships(
                'add', category.id, [id], []
            )
        ]) : [];
        
        const insertedRecording = await (async () => {
            await db.recordings.add(recording);
            return await db.recordings.get(id);
        })();

        if (!insertedRecording) throw new Error('Recording could not be created.');

        return {
            recording: insertedRecording,
            updatedCategories
        }
    });
}

// UPDATE

export const updateRecordingCategory = (
    id: string, 
    categoryId: string | undefined
): Promise<Recording> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        if (categoryId) {
            const category = await db.categories.get(categoryId);
            if (!category) throw new Error('Recording was assigned a non-existant category.');
        }

        await db.recordings.where('id').equals(id).modify(recording => {
            recording.relationships.category.id = categoryId;
        });

        const updated = await db.recordings.get(id);

        if (!updated) throw new Error('Recording could not be updated.');

        return updated;
    });
}

export const updateRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const previousRecording = await db.recordings.get(recording.id);

        if (!previousRecording) throw new Error('Recording could not be retrieved');

        const updatedCategories = await (async () => {
            const { id: prevId } = previousRecording.relationships.category;
            const { id: newId } = recording.relationships.category;

            const unEqual = prevId !== newId;

            const removed = unEqual && prevId ? ([
                await CategoryController.updateCategoryRelationships(
                    'remove', prevId, [recording.id], []
                )
            ]) : [];

            const added = unEqual && newId ? ([
                await CategoryController.updateCategoryRelationships(
                    'add', newId, [recording.id], []
                )
            ]) : [];

            return [...added, ...removed];
        })();

        const insertedRecording = await (async () => {
            await db.recordings.put(recording);
            return await db.recordings.get(recording.id);
        })();

        if (!insertedRecording) throw new Error('Recording could not be updated.');

        return {
            recording: insertedRecording,
            updatedCategories
        }
    });
}

// DELETE

export const deleteRecording = (id: string): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const recording = await db.recordings.get(id);

        if (!recording) throw new Error('Recording could not be retrieved.');

        const categoryId = recording.relationships.category.id;

        const updatedCategories = categoryId ? (
            [await CategoryController.updateCategoryRelationships(
                'remove', categoryId, [id], []
            )]
        ) : [];

        await db.recordings.delete(id);

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