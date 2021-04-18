import { db } from '../../db';

import getArrayModifications from '../../../lib/utils/getArrayModifications';

import Category from '../../models/Category';

import Recording from '../../models/Recording';
import { RecordingController } from '../Recording';

import Note from '../../models/Note';
import { NoteController } from '../Note';

// SELECT

export const selectCategory = async (id: string): Promise<Category> => {
    const category = await db.categories.get(id);
    if (!category) throw new Error('Category could not be retrieved.');
    return category;
}

export const selectUserCategories = (userId: string): Promise<Category[]> => {
    return db.categories.where({"relationships.user.id": userId}).toArray();
}

// INSERT

export const insertCategory = (category: Category): Promise<{
    category: Category;
    updatedRecordings: Recording[];
    updatedNotes: Note[];
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
        const { id, relationships: { recordings, notes } } = category;

        const updatedRecordings = await Promise.all(recordings.ids.map(async recId => {
            return await RecordingController.updateRecordingCategory(recId, id);
        }));

        const updatedNotes = await Promise.all(notes.ids.map(async noteId => {
            return await NoteController.updateNoteCategory(noteId, id);
        }));

        const updatedCategories = await (async () => {
            const targettedCategories = await (
                db.categories
                .where('relationships.recordings.ids').anyOf(recordings.ids)
                .or('relationships.notes.ids').anyOf(notes.ids)
                .toArray()
            );

            return Promise.all(targettedCategories.map(category => {
                return updateCategoryRelationships(
                    'remove', category.id, recordings.ids, notes.ids
                );
            }));
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

export const updateCategoryRelationships = (
    method: 'add' | 'remove',
    id: string,
    recordingIds: string[],
    noteIds: string[]
): Promise<Category> => {
    return db.transaction('rw', db.categories, async () => {
        const category = db.categories.where('id').equals(id);

        const modifier = {
            add: (target: string[], source: string[]) => target = [...target, ...source],
            remove: (target: string[], source: string[]) => target = target.filter(id => !source.includes(id))
        }[method];

        if (recordingIds.length > 0) await category.modify(record => modifier(
            record.relationships.recordings.ids,
            recordingIds
        ));

        if (noteIds.length > 0) await category.modify(record => modifier(
            record.relationships.notes.ids,
            noteIds
        ));

        const updated = await db.categories.get(id);

        if (!updated) throw new Error('Could not update Category ids.');

        return updated;
    })
}

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

        const recMods = getArrayModifications(prevRecordings.ids, newRecordings.ids);
        const noteMods = getArrayModifications(prevNotes.ids, newNotes.ids);

        const updatedRecordings = await (async () => {
            const added = await Promise.all(recMods.added.map(recId => {
                return RecordingController.updateRecordingCategory(recId, category.id);
            }));

            const removed = await Promise.all(recMods.removed.map(recId => {
                return RecordingController.updateRecordingCategory(recId, undefined);
            }));

            return [...added, ...removed];
        })();

        const updatedNotes = await (async () => {
            const added = await Promise.all(noteMods.added.map(noteId => {
                return NoteController.updateNoteCategory(noteId, category.id);
            }));
            
            const removed = await Promise.all(noteMods.removed.map(noteId => {
                return NoteController.updateNoteCategory(noteId, undefined);
            }))

            return [...added, ...removed];
        })();

        const updatedCategories = await (async () => {
            const targettedCategories = await (
                db.categories
                .where('relationships.recordings.ids').anyOf(recMods.added)
                .or('relationships.notes.ids').anyOf(noteMods.added)
                .toArray()
            );

            return Promise.all(targettedCategories.map(category => {
                return updateCategoryRelationships(
                    'remove', category.id, recMods.added, noteMods.added
                );
            }));
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

export const deleteCategory = (id: string): Promise<{
    updatedRecordings: Recording[];
    updatedNotes: Note[];
}> => {
    return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
        const category = await db.categories.get(id);

        if (!category) throw new Error('Category could not be retrieved');

        const {relationships: { recordings, notes }} = category;

        const updatedRecordings = await Promise.all(recordings.ids.map(recId => (
            RecordingController.updateRecordingCategory(recId, undefined)
        )));

        const updatedNotes = await Promise.all(notes.ids.map(noteId => (
            NoteController.updateNoteCategory(noteId, undefined)
        )));

        await db.categories.delete(id);

        return {
            updatedRecordings,
            updatedNotes
        }
    });
}

export const deleteCategories = (ids: string[]): Promise<{
    updatedRecordings: Recording[];
    updatedNotes: Note[];
}> => {
    return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
        const updatedRecordingIds: Set<string> = new Set();
        const updatedNoteIds: Set<string> = new Set();

        for (const id of ids) {
            const { updatedRecordings, updatedNotes } = await deleteCategory(id);
            updatedRecordings.forEach(recording => updatedRecordingIds.add(recording.id));
            updatedNotes.forEach(note => updatedNoteIds.add(note.id));
        }

        const updatedRecordings = await (
            db.recordings
            .where('id').anyOf(Array.from(updatedRecordingIds))
            .toArray()
        );

        const updatedNotes = await (
            db.notes
            .where('id').anyOf(Array.from(updatedNoteIds))
            .toArray()
        )

        return {
            updatedRecordings,
            updatedNotes
        }
    })
}