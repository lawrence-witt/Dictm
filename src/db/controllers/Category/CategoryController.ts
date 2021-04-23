import { db } from '../../db';

import getArrayModifications from '../../../lib/utils/getArrayModifications';

import { CommonController } from '../Common';

import Category from '../../models/Category';
import Recording from '../../models/Recording';
import Note from '../../models/Note';

// SELECT

export const selectCategory = async (id: string): Promise<Category> => {
    return CommonController.selectModelById("categories", id);
}

export const selectUserCategories = (userId: string): Promise<Category[]> => {
    return CommonController.selectModelsByUserId("categories", userId);
}

export const selectCategoriesByResourceIds = (
    recordingIds: string[],
    noteIds: string[],
    exclude?: string[]
): Promise<Category[]> => {
    return (
        db.categories
        .where('relationships.recordings.ids').anyOf(recordingIds)
        .or('relationships.notes.ids').anyOf(noteIds)
        .and(category => exclude ? !exclude.includes(category.id) : true)
        .toArray()
    )
}

// INSERT

export const insertCategory = (category: Category): Promise<{
    category: Category;
    updatedRecordings: Recording[];
    updatedNotes: Note[];
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.categories, db.recordings, db.notes, async () => {
        const { id, relationships: { recordings, notes } } = category;

        const insertedModel = await CommonController.insertModel("categories", category);

        const updatedRecordings = await Promise.all(recordings.ids.map(recId => {
            return CommonController.updateMediaCategory("recordings", recId, id);
        }));

        const updatedNotes = await Promise.all(notes.ids.map(noteId => {
            return CommonController.updateMediaCategory("notes", noteId, id);
        }));

        const updatedCategories = await (async () => {
            const targettedCategories = await selectCategoriesByResourceIds(
                recordings.ids,
                notes.ids,
                [category.id]
            );

            return Promise.all(targettedCategories.map(category => {
                return CommonController.updateCategoryMedia(
                    'remove', category.id, recordings.ids, notes.ids
                );
            }));
        })();

        return {
            category: insertedModel,
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
    return db.transaction('rw', db.users, db.categories, db.recordings, db.notes, async () => {
        const { previous, current } = await CommonController.updateModel("categories", category);

        const { recordings: prevRecordings, notes: prevNotes } = previous.relationships;
        const { recordings: newRecordings, notes: newNotes } = current.relationships;

        const recMods = getArrayModifications(prevRecordings.ids, newRecordings.ids);
        const noteMods = getArrayModifications(prevNotes.ids, newNotes.ids);

        const updatedRecordings = await (async () => {
            const added = await Promise.all(recMods.added.map(recId => {
                return CommonController.updateMediaCategory("recordings", recId, current.id);
            }));

            const removed = await Promise.all(recMods.removed.map(recId => {
                return CommonController.updateMediaCategory("recordings", recId, undefined);
            }));

            return [...added, ...removed];
        })();

        const updatedNotes = await (async () => {
            const added = await Promise.all(noteMods.added.map(noteId => {
                return CommonController.updateMediaCategory("notes", noteId, current.id);
            }));
            
            const removed = await Promise.all(noteMods.removed.map(noteId => {
                return CommonController.updateMediaCategory("notes", noteId, undefined);
            }))

            return [...added, ...removed];
        })();

        const updatedCategories = await (async () => {
            const targettedCategories = await selectCategoriesByResourceIds(
                recMods.added,
                noteMods.added,
                [category.id]
            );

            return Promise.all(targettedCategories.map(category => {
                return CommonController.updateCategoryMedia(
                    'remove', category.id, recMods.added, noteMods.added
                );
            }));
        })();

        return {
            updatedRecordings,
            updatedNotes,
            updatedCategories: [current, ...updatedCategories]
        }
    });
}

// DELETE

export const deleteCategory = (id: string): Promise<{
    updatedRecordings: Recording[];
    updatedNotes: Note[];
}> => {
    return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
        const deleted = await CommonController.deleteModel("categories", id);

        const { relationships: { recordings, notes } } = deleted;

        const updatedRecordings = await Promise.all(recordings.ids.map(recId => (
            CommonController.updateMediaCategory("recordings", recId, undefined)
        )));

        const updatedNotes = await Promise.all(notes.ids.map(noteId => (
            CommonController.updateMediaCategory("notes", noteId, undefined)
        )));

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