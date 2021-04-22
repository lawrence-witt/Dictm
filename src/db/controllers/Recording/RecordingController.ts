import { db } from '../../db';

import Category from '../../models/Category';
import { CategoryController } from '../Category';

import Recording from '../../models/Recording';

// SELECT

export const selectRecording = async (id: string): Promise<Recording> => {
    const recording = await db.recordings.get(id);
    if (!recording) throw new Error('Recording does not exist.');
    return recording;
}

export const selectUserRecordings = (userId: string): Promise<Recording[]> => {
    return db.transaction("r", db.users, db.recordings, async () => {
        if (!(await db.users.get(userId))) throw new Error('User does not exist.');
        return db.recordings.where({"relationships.user.id": userId}).toArray();
    });
}

// INSERT

export const insertRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.recordings, db.categories, async () => {
        const { id, relationships: { category, user } } = recording;

        if (!(await db.users.get(user.id))) throw new Error('User does not exist.');

        const insertedModel = await (async () => {
            await db.recordings.add(recording);
            const model =  await db.recordings.get(id);
            if (!model) throw new Error('Recording could not be inserted.');
            return model;
        })();

        const updatedCategories = category.id ? ([
            await CategoryController.updateCategoryRelationships(
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
    return db.transaction('rw', db.recordings, db.categories, async () => {
        if (categoryId && !(await db.categories.get(categoryId))) {
            throw new Error('Category does not exist.');
        }

        await db.recordings.where('id').equals(id).modify(recording => {
            recording.relationships.category.id = categoryId;
        });

        const updated = await db.recordings.get(id);
        if (!updated) throw new Error('Recording does not exist.');

        return updated;
    });
}

export const updateRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.recordings, db.categories, async () => {
        const { id, relationships: { user } } = recording;

        const existing = await db.recordings.get(id);
        if (!existing) throw new Error('Recording does not exist.');

        if (!(await db.users.get(user.id))) throw new Error('User does not exist.');

        const updatedModel = await (async () => {
            await db.recordings.update(id, recording);
            const model = await db.recordings.get(id);
            if (!model) throw new Error('Recording does not exist.');
            return model;
        })();

        const updatedCategories = await (async () => {
            const { id: prevId } = existing.relationships.category;
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

        return {
            recording: updatedModel,
            updatedCategories
        }
    });
}

// DELETE

export const deleteRecording = (id: string): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const existing = await db.recordings.get(id);
        if (!existing) throw new Error('Recording does not exist.');

        const categoryId = existing.relationships.category.id;

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