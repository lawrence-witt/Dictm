import { db } from '../../db';

import Category from '../../models/Category';
import { CategoryController } from '../Category';

import Note from '../../models/Note';

// SELECT

export const selectNote = async (id: string): Promise<Note> => {
    const note = await db.notes.get(id);
    if (!note) throw new Error('Note does not exist.');
    return note;
}

export const selectUserNotes = (userId: string): Promise<Note[]> => {
    return db.transaction("r", db.users, db.notes, async () => {
        if (!(await db.users.get(userId))) throw new Error('User does not exist.');
        return db.notes.where({"relationships.user.id": userId}).toArray();
    });
}

// INSERT

export const insertNote = (note: Note): Promise<{
    note: Note;
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.users, db.notes, db.categories, async () => {
        const { id, relationships: { category, user } } = note;

        if (!(await db.users.get(user.id))) throw new Error('User does not exist.');

        const insertedModel = await (async () => {
            await db.notes.add(note);
            const model = await db.notes.get(id);
            if (!model) throw new Error('Note could not be inserted.');
            return model;
        })();

        const updatedCategories = category.id ? ([
            await CategoryController.updateCategoryRelationships(
                'add', category.id, [], [id]
            )
        ]) : [];

        return {
            note: insertedModel,
            updatedCategories
        }
    });
}

// UPDATE

export const updateNoteCategory = (
    id: string, 
    categoryId: string | undefined
): Promise<Note> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        if (categoryId && !(await db.categories.get(categoryId))) {
            throw new Error('Category does not exist.');
        }

        await db.notes.where('id').equals(id).modify(note => {
            note.relationships.category.id = categoryId;
        });

        const updated = await db.notes.get(id);
        if (!updated) throw new Error('Note does not exist.');
        
        return updated;
    });
}

export const updateNote = (note: Note): Promise<{
    note: Note,
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.notes, db.categories, async () => {
        const { id, relationships: { user } } = note;

        const existing = await db.notes.get(id);
        if (!existing) throw new Error('Note does not exist.');

        if (!(await db.users.get(user.id))) throw new Error('User does not exist.');

        const updatedModel = await (async () => {
            await db.notes.update(id, note);
            const model = await db.notes.get(id);
            if (!model) throw new Error("Note does not exist.");
            return model;
        })();

        const updatedCategories = await (async () => {
            const { id: prevId } = existing.relationships.category;
            const { id: newId } = note.relationships.category;

            const unEqual = prevId !== newId;

            const removed = unEqual && prevId ? ([
                await CategoryController.updateCategoryRelationships(
                    'remove', prevId, [], [note.id]
                )
            ]) : [];

            const added = unEqual && newId ? ([
                await CategoryController.updateCategoryRelationships(
                    'add', newId, [], [note.id]
                )
            ]) : [];

            return [...added, ...removed];
        })();

        return {
            note: updatedModel,
            updatedCategories
        }
    });
}

// DELETE

export const deleteNote = (id: string): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const existing = await db.notes.get(id);
        if (!existing) throw new Error('Note does not exist.');

        const categoryId = existing.relationships.category.id;

        const updatedCategories = categoryId ? (
            [await CategoryController.updateCategoryRelationships(
                'remove', categoryId, [], [id]
            )]
        ) : [];

        await db.notes.delete(id);

        return {
            updatedCategories
        };
    });
}

export const deleteNotes = (ids: string[]): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const updatedCategoryIds: Set<string> = new Set();

        for (const id of ids) {
            const result = await deleteNote(id);
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