import { db } from '../../db';

import Category from '../../models/Category';
import Recording from '../../models/Recording';

// SELECT

// INSERT

export const insertRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const updatedCategories = await (async () => {
            const { id } = recording.relationships.category;

            const result: Category[] = [];

            if (id) {
                await db.categories.where('id').equals(id).modify(category => {
                    category.relationships.recordings.ids.push(recording.id);
                });
    
                const updated = await db.categories.get(id);
                if (updated) result.push(updated);
            }

            return result;
        })();
        
        const insertedRecording = await (async () => {
            await db.recordings.add(recording);
            return await db.recordings.get(recording.id);
        })();

        if (!insertedRecording) throw new Error('Recording could not be created.');

        return {
            recording: insertedRecording,
            updatedCategories
        }
    });
}

// UPDATE

export const updateRecording = (recording: Recording): Promise<{
    recording: Recording;
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.recordings, db.categories, async () => {
        const initialRecording = await db.recordings.get(recording.id);

        if (!initialRecording) throw new Error('Recording could not be retrieved');

        const updatedCategories = await (async () => {
            const { id: originalId } = initialRecording.relationships.category;
            const { id: newId } = recording.relationships.category;

            const result: Category[] = [];

            if (originalId === newId) return result;

            if (originalId) {
                await db.categories.where('id').equals(originalId).modify(category => {
                    (ids => ids = ids.filter(id => id !== recording.id))
                    (category.relationships.recordings.ids);
                });
                const updated = await db.categories.get(originalId);
                if (updated) result.push(updated);
            }

            if (newId) {
                await db.categories.where('id').equals(newId).modify(category => {
                    category.relationships.recordings.ids.push(recording.id);
                });
                const updated = await db.categories.get(newId);
                if (updated) result.push(updated);
            }

            return result;
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