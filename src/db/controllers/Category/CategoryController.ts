import { db } from '../../db';

import Category from '../../models/Category';
import Recording from '../../models/Recording';
import Note from '../../models/Note';

// SELECT

// INSERT

export const insertCategory = (category: Category): Promise<{
    category: Category;
    updatedRecordings: Recording[];
    updatedNotes: Note[];
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
        const { id, relationships: { recordings, notes } } = category;

        const updatedRecordings = await (async () => {
            const targettedRecordings = db.recordings.where('id').anyOf(recordings.ids);

            await targettedRecordings.modify(recording => {
                recording.relationships.category.id = id;
            });

            return targettedRecordings.toArray();
        })();

        const updatedNotes = await (async () => {
            const targettedNotes = db.notes.where('id').anyOf(notes.ids);

            await targettedNotes.modify(note => {
                note.relationships.category.id = id;
            });

            return targettedNotes.toArray();
        })();

        const updatedCategories = await (async () => {
            const targettedCategories = (
                db.categories
                .where('relationships.recordings.ids').anyOf(recordings.ids)
                .or('relationships.notes.ids').anyOf(notes.ids)
            );

            await targettedCategories.modify(category => {
                (ids => ids = ids.filter(id => !recordings.ids.includes(id)))
                (category.relationships.recordings.ids);
                (ids => ids = ids.filter(id => !notes.ids.includes(id)))
                (category.relationships.notes.ids);
            });

            return targettedCategories.toArray();
        })();

        const insertedCategory = await (async () => {
            await db.categories.add(category);
            return db.categories.get(category.id);
        })();

        if (!insertedCategory) throw new Error('Category could not be created.');

        return {
            category: insertedCategory,
            updatedRecordings,
            updatedNotes,
            updatedCategories
        }
    });
}

// UPDATE

export const updateCategory = (category: Category): Promise<{
    updatedRecordings: Recording[];
    updatedNotes: Note[];
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
        const previousCategory = await db.categories.get(category.id);

        if (!previousCategory) throw new Error('Category could not be retrieved.');

        const { recordings: newRecordings, notes: newNotes } = category.relationships;
        const { recordings: prevRecordings, notes: prevNotes } = previousCategory.relationships;

        const recsToRemove = prevRecordings.ids.filter(id => !newRecordings.ids.includes(id));
        const notesToRemove = prevNotes.ids.filter(id => !newNotes.ids.includes(id));
        const recsToAdd = newRecordings.ids.filter(id => !prevRecordings.ids.includes(id));
        const notesToAdd = newNotes.ids.filter(id => !prevNotes.ids.includes(id));

        const updatedRecordings = await (async () => {
            const addedRecordings = db.recordings.where('id').anyOf(recsToAdd);
            const removedRecordings = db.recordings.where('id').anyOf(recsToRemove);

            await addedRecordings.modify(recording => {
                recording.relationships.category.id = category.id;
            });

            await removedRecordings.modify(recording => {
                recording.relationships.category.id = undefined;
            });

            return [
                ...(await addedRecordings.toArray()), 
                ...(await removedRecordings.toArray())
            ];
        })();

        const updatedNotes = await (async () => {
            const addedNotes = db.notes.where('id').anyOf(notesToAdd);
            const removedNotes = db.notes.where('id').anyOf(notesToRemove);

            await addedNotes.modify(note => {
                note.relationships.category.id = category.id;
            });

            await removedNotes.modify(note => {
                note.relationships.category.id = undefined;
            });

            return [
                ...(await addedNotes.toArray()),
                ...(await removedNotes.toArray())
            ];
        })();

        const updatedCategories = await (async () => {
            const targettedCategories = (
                db.categories
                .where('relationships.recordings.ids').anyOf(recsToAdd)
                .or('relationships.notes.ids').anyOf(notesToAdd)
            );

            await targettedCategories.modify(category => {
                (ids => ids = ids.filter(id => !recsToAdd.includes(id)))
                (category.relationships.recordings.ids);
                (ids => ids = ids.filter(id => !notesToAdd.includes(id)))
                (category.relationships.notes.ids);
            });

            return targettedCategories.toArray();
        })();

        const insertedCategory = await (async () => {
            await db.categories.put(category);
            return db.categories.get(category.id);
        })();

        if (!insertedCategory) throw new Error('Category could not be updated.');

        return {
            updatedRecordings,
            updatedNotes,
            updatedCategories: [insertedCategory, ...updatedCategories]
        }
    });
}

// DELETE