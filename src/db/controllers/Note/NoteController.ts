import { db } from '../../db';

import Category from '../../models/Category';
import Note from '../../models/Note';

// SELECT

// INSERT

export const insertNote = (note: Note): Promise<{
    note: Note;
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const updatedCategories = await (async () => {
            const { id } = note.relationships.category;

            const result: Category[] = [];

            if (id) {
                await db.categories.where('id').equals(id).modify(category => {
                    category.relationships.notes.ids.push(note.id);
                });
    
                const updated = await db.categories.get(id);
                if (updated) result.push(updated);
            }

            return result;
        })();
        
        const insertedNote = await (async () => {
            await db.notes.add(note);
            return db.notes.get(note.id);
        })();

        if (!insertedNote) throw new Error('Note could not be created.');

        return {
            note: insertedNote,
            updatedCategories
        }
    });
}

// UPDATE

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

            const result: Category[] = [];

            if (prevId === newId) return result;

            if (prevId) {
                await db.categories.where('id').equals(prevId).modify(category => {
                    (ids => ids = ids.filter(id => id !== note.id))
                    (category.relationships.notes.ids);
                });
                const updated = await db.categories.get(prevId);
                if (updated) result.push(updated);
            }

            if (newId) {
                await db.categories.where('id').equals(newId).modify(category => {
                    category.relationships.notes.ids.push(note.id);
                });
                const updated = await db.categories.get(newId);
                if (updated) result.push(updated);
            }

            return result;
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