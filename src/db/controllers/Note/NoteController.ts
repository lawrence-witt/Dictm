import { db } from '../../db';

import Category from '../../models/Category';
import { CategoryController } from '../Category';

import Note from '../../models/Note';

// SELECT

export const selectNote = async (id: string): Promise<Note> => {
    const note = await db.notes.get(id);
    if (!note) throw new Error('Note could not be retrieved.');
    return note;
}

export const selectUserNotes = (userId: string): Promise<Note[]> => {
    return db.notes.where({"relationships.user.id": userId}).toArray();
}

// INSERT

export const insertNote = (note: Note): Promise<{
    note: Note;
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const { id, relationships: { category } } = note;

        const updatedCategories = category.id ? ([
            await CategoryController.updateCategoryRelationships(
                'add', category.id, [], [id]
            )
        ]) : [];
        
        const insertedNote = await (async () => {
            await db.notes.add(note);
            return db.notes.get(id);
        })();

        if (!insertedNote) throw new Error('Note could not be created.');

        return {
            note: insertedNote,
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
        if (categoryId) {
            const category = await db.categories.get(categoryId);
            if (!category) throw new Error('Note was assigned a non-existant category.');
        }

        await db.notes.where('id').equals(id).modify(note => {
            note.relationships.category.id = categoryId;
        });

        const updated = await db.notes.get(id);

        if (!updated) throw new Error('Note could not be updated.');
        
        return updated;
    });
}

export const updateNote = (note: Note): Promise<{
    note: Note,
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const previousNote = await db.notes.get(note.id);

        if (!previousNote) throw new Error('Note could not be retrieved');

        const updatedCategories = await (async () => {
            const { id: prevId } = previousNote.relationships.category;
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

        const insertedNote = await (async () => {
            await db.notes.put(note);
            return db.notes.get(note.id);
        })();

        if (!insertedNote) throw new Error('Note could not be updated.');

        return {
            note: insertedNote,
            updatedCategories
        }
    });
}

// DELETE

export const deleteNote = (id: string): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const note = await db.notes.get(id);

        if (!note) throw new Error('Note could not be retrieved.');

        const categoryId = note.relationships.category.id;

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
    return db.transaction('rw', db.recordings, db.categories, async () => {
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