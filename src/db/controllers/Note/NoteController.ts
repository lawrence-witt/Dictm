import { db } from '../../db';

import { CommonController } from '../Common';

import Note from '../../models/Note';
import Category from '../../models/Category';

interface NoteAndCategoriesReturn {
    note: Note;
    updatedCategories: Category[];
}

type CategoriesReturn = Omit<NoteAndCategoriesReturn, "note">;

// SELECT

export const selectNote = async (id: string): Promise<Note> => {
    return CommonController.selectModelById("notes", id);
}

export const selectNotesById = async (ids: string[]): Promise<Note[]> => {
    return CommonController.selectModelsById("notes", ids);
}

export const selectNotesByUserId = (userId: string): Promise<Note[]> => {
    return CommonController.selectModelsByUserId("notes", userId);
}

// INSERT

export const _insertNote = (
    insertFn: typeof CommonController["insertModel"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"]
) => {
    return (note: Note): Promise<NoteAndCategoriesReturn> => {
        return db.transaction('rw', db.users, db.notes, db.categories, async () => {
            const { id, relationships: { category } } = note;
    
            const insertedModel = await insertFn("notes", note);
    
            const updatedCategories = category.id ? ([
                await updateCategoryFn('add', category.id, [], [id])
            ]) : [];
    
            return {
                note: insertedModel,
                updatedCategories
            }
        });
    }
}

export const insertNote = (note: Note): Promise<NoteAndCategoriesReturn> => {
    return _insertNote(CommonController.insertModel, CommonController.updateCategoryMedia)(note);
}

// UPDATE

export const _updateNote = (
    updateFn: typeof CommonController["updateModel"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"]
) => {
    return (note: Note): Promise<NoteAndCategoriesReturn> => {
        return db.transaction('rw', db.users, db.notes, db.categories, async () => {
            const { previous, current } = await updateFn("notes", note);
    
            const updatedCategories = await (async () => {
                const { id: prevId } = previous.relationships.category;
                const { id: newId } = current.relationships.category;
    
                const unEqual = prevId !== newId;
    
                const removed = unEqual && prevId ? ([
                    await updateCategoryFn('remove', prevId, [], [note.id])
                ]) : [];
    
                const added = unEqual && newId ? ([
                    await updateCategoryFn('add', newId, [], [note.id])
                ]) : [];
    
                return [...added, ...removed];
            })();
    
            return {
                note: current,
                updatedCategories
            }
        });
    }
}

export const updateNote = (note: Note): Promise<NoteAndCategoriesReturn> => {
    return _updateNote(CommonController.updateModel, CommonController.updateCategoryMedia)(note);
}

// DELETE

export const _deleteNote = (
    deleteFn: typeof CommonController["deleteModelById"],
    updateCategoryFn: typeof CommonController["updateCategoryMedia"]
) => {
    return (id: string): Promise<CategoriesReturn> => {
        return db.transaction('rw', db.notes, db.categories, async () => {
            const deleted = await deleteFn("notes", id);
    
            const categoryId = deleted.relationships.category.id;
    
            const updatedCategories = categoryId ? (
                [await updateCategoryFn('remove', categoryId, [], [id])]
            ) : [];
    
            return {
                updatedCategories
            };
        });
    }
}

export const deleteNote = (id: string): Promise<CategoriesReturn> => {
    return _deleteNote(CommonController.deleteModelById, CommonController.updateCategoryMedia)(id);
}

export const _deleteNotes = (
    deleteFn: typeof deleteNote,
    selectFn: typeof CommonController["selectModelsById"]
) => {
    return (ids: string[]): Promise<CategoriesReturn> => {
        return db.transaction('rw', db.notes, db.categories, async () => {
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

export const deleteNotes = (ids: string[]): Promise<CategoriesReturn> => {
    return _deleteNotes(deleteNote, CommonController.selectModelsById)(ids);
}