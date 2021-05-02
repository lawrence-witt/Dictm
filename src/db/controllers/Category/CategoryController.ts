import { db } from '../../db';

import getArrayModifications from '../../../lib/utils/getArrayModifications';

import { CommonController } from '../Common';

import Category from '../../models/Category';
import Recording from '../../models/Recording';
import Note from '../../models/Note';

interface MediaReturn {
    updatedRecordings: Recording[];
    updatedNotes: Note[];
}

interface ResourceReturn extends MediaReturn {
    updatedCategories: Category[]
}

interface InsertReturn extends ResourceReturn {
    category: Category;
}

// SELECT

export const selectCategory = (id: string): Promise<Category> => {
    return CommonController.selectModelById("categories", id);
}

export const selectCategoriesById = (ids: string[]): Promise<Category[]> => {
    return CommonController.selectModelsById("categories", ids);
}

export const selectCategoriesByUserId = (userId: string): Promise<Category[]> => {
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

export const _insertCategory = (
    insertFn: typeof CommonController["insertModel"],
    updateMediaFn: typeof CommonController["updateMediaCategory"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"],
    selectFn: typeof selectCategoriesByResourceIds
) => {
    return (category: Category): Promise<InsertReturn> => {
        return db.transaction('rw', db.users, db.categories, db.recordings, db.notes, async () => {
            const { id, relationships: { recordings, notes } } = category;
    
            const insertedModel = await insertFn("categories", category);
    
            const updatedRecordings = await Promise.all(recordings.ids.map(recId => {
                return updateMediaFn("recordings", recId, id);
            }));
    
            const updatedNotes = await Promise.all(notes.ids.map(noteId => {
                return updateMediaFn("notes", noteId, id);
            }));
    
            const updatedCategories = await (async () => {
                const targettedCategories = recordings.ids.length > 0 || notes.ids.length > 0 ? (
                    await selectFn(recordings.ids, notes.ids, [category.id])
                ) : [];
    
                return Promise.all(targettedCategories.map(category => {
                    return updateCategoryFn('remove', category.id, recordings.ids, notes.ids);
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
}

export const insertCategory = (category: Category): Promise<InsertReturn> => {
    return _insertCategory(
        CommonController.insertModel, 
        CommonController.updateMediaCategory, 
        CommonController.updateCategoryMedia, 
        selectCategoriesByResourceIds
    )(category);
}

// UPDATE

export const _updateCategory = (
    updateFn: typeof CommonController["updateModel"],
    updateMediaFn: typeof CommonController["updateMediaCategory"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"],
    selectFn: typeof selectCategoriesByResourceIds
) => {
    return (category: Category): Promise<ResourceReturn> => {
        return db.transaction('rw', db.users, db.categories, db.recordings, db.notes, async () => {
            const { previous, current } = await updateFn("categories", category);
    
            const { recordings: prevRecordings, notes: prevNotes } = previous.relationships;
            const { recordings: newRecordings, notes: newNotes } = current.relationships;
    
            const recMods = getArrayModifications(prevRecordings.ids, newRecordings.ids);
            const noteMods = getArrayModifications(prevNotes.ids, newNotes.ids);
    
            const updatedRecordings = await (async () => {
                const added = await Promise.all(recMods.added.map(recId => {
                    return updateMediaFn("recordings", recId, current.id);
                }));
    
                const removed = await Promise.all(recMods.removed.map(recId => {
                    return updateMediaFn("recordings", recId, undefined);
                }));
    
                return [...added, ...removed];
            })();
    
            const updatedNotes = await (async () => {
                const added = await Promise.all(noteMods.added.map(noteId => {
                    return updateMediaFn("notes", noteId, current.id);
                }));
                
                const removed = await Promise.all(noteMods.removed.map(noteId => {
                    return updateMediaFn("notes", noteId, undefined);
                }))
    
                return [...added, ...removed];
            })();
    
            const updatedCategories = await (async () => {
                const targettedCategories = recMods.added.length > 0 || noteMods.added.length > 0 ? (
                    await selectFn(recMods.added, noteMods.added, [category.id])
                ): [];
    
                return Promise.all(targettedCategories.map(category => {
                    return updateCategoryFn('remove', category.id, recMods.added, noteMods.added);
                }));
            })();
    
            return {
                updatedRecordings,
                updatedNotes,
                updatedCategories: [current, ...updatedCategories]
            }
        });
    }
}

export const updateCategory = (category: Category): Promise<ResourceReturn> => {
    return _updateCategory(
        CommonController.updateModel, 
        CommonController.updateMediaCategory, 
        CommonController.updateCategoryMedia, 
        selectCategoriesByResourceIds
    )(category);
}

// DELETE

export const _deleteCategory = (
    deleteFn: typeof CommonController["deleteModelById"],
    updateMediaFn: typeof CommonController["updateMediaCategory"]
) => {
    return (id: string): Promise<MediaReturn> => {
        return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
            const deleted = await deleteFn("categories", id);
    
            const { relationships: { recordings, notes } } = deleted;
    
            const updatedRecordings = await Promise.all(recordings.ids.map(recId => (
                updateMediaFn("recordings", recId, undefined)
            )));
    
            const updatedNotes = await Promise.all(notes.ids.map(noteId => (
                updateMediaFn("notes", noteId, undefined)
            )));
    
            return {
                updatedRecordings,
                updatedNotes
            }
        });
    }
}

export const deleteCategory = (id: string): Promise<MediaReturn> => {
    return _deleteCategory(CommonController.deleteModelById, CommonController.updateMediaCategory)(id);
}

export const _deleteCategories = (
    deleteFn: typeof deleteCategory,
    selectFn: typeof CommonController["selectModelsById"]
) => {
    return (ids: string[]): Promise<MediaReturn> => {
        return db.transaction('rw', db.categories, db.recordings, db.notes, async () => {
            const updatedRecordingIds: Set<string> = new Set();
            const updatedNoteIds: Set<string> = new Set();
    
            for (const id of ids) {
                const { updatedRecordings, updatedNotes } = await deleteFn(id);
                updatedRecordings.forEach(recording => updatedRecordingIds.add(recording.id));
                updatedNotes.forEach(note => updatedNoteIds.add(note.id));
            }
    
            const updatedRecordings = updatedRecordingIds.size > 0 ? (
                await selectFn("recordings", Array.from(updatedRecordingIds))
            ): [];

            const updatedNotes = updatedNoteIds.size > 0 ? (
                await selectFn("notes", Array.from(updatedNoteIds))
            ) : [];
    
            return {
                updatedRecordings,
                updatedNotes
            }
        })
    }
}

export const deleteCategories = (ids: string[]): Promise<MediaReturn> => {
    return _deleteCategories(deleteCategory, CommonController.selectModelsById)(ids);
}