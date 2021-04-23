import { db } from '../../db';

import { CommonController } from '../Common';

import Note from '../../models/Note';
import Category from '../../models/Category';

// SELECT

export const selectNote = async (id: string): Promise<Note> => {
    return CommonController.selectModelById("notes", id);
}

export const selectUserNotes = (userId: string): Promise<Note[]> => {
    return CommonController.selectModelsByUserId("notes", userId);
}

// INSERT

export const insertNote = (note: Note): Promise<{
    note: Note;
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.users, db.notes, db.categories, async () => {
        const { id, relationships: { category, user } } = note;

        if (!(await db.users.get(user.id))) throw new Error('User does not exist.');

        const insertedModel = await CommonController.insertModel("notes", note);

        const updatedCategories = category.id ? ([
            await CommonController.updateCategoryMedia(
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
    return CommonController.updateMediaCategory("notes", id, categoryId);
}

export const updateNote = (note: Note): Promise<{
    note: Note,
    updatedCategories: Category[];
}> => {
    return db.transaction('rw', db.users, db.notes, db.categories, async () => {
        const { relationships: { user } } = note;

        if (!(await db.users.get(user.id))) throw new Error('User does not exist.');

        const { previous, current } = await CommonController.updateModel("notes", note);

        const updatedCategories = await (async () => {
            const { id: prevId } = previous.relationships.category;
            const { id: newId } = current.relationships.category;

            const unEqual = prevId !== newId;

            const removed = unEqual && prevId ? ([
                await CommonController.updateCategoryMedia(
                    'remove', prevId, [], [note.id]
                )
            ]) : [];

            const added = unEqual && newId ? ([
                await CommonController.updateCategoryMedia(
                    'add', newId, [], [note.id]
                )
            ]) : [];

            return [...added, ...removed];
        })();

        return {
            note: current,
            updatedCategories
        }
    });
}

// DELETE

export const deleteNote = (id: string): Promise<{
    updatedCategories: Category[]
}> => {
    return db.transaction('rw', db.notes, db.categories, async () => {
        const deleted = await CommonController.deleteModel("notes", id);

        const categoryId = deleted.relationships.category.id;

        const updatedCategories = categoryId ? (
            [await CommonController.updateCategoryMedia(
                'remove', categoryId, [], [id]
            )]
        ) : [];

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