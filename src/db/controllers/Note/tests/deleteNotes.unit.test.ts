import { db } from '../../../db';

import { NoteController } from '..';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes a list of Notes from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const noteIds = seeded.notes.map(note => note.id);

    await NoteController.deleteNotes(noteIds);
    const retrieved = await db.notes.where("id").anyOf(noteIds).toArray();

    expect(retrieved).toHaveLength(0);

    done();
});

test("it updates any Categories which linked the deleted Notes", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newNote = new Note(seeded.user.id);
    const newCategory = new Category(seeded.user.id);
    newNote.relationships.category.id = newCategory.id;
    newCategory.relationships.notes.ids.push(newNote.id);

    await db.notes.add(newNote);
    await db.categories.add(newCategory);
    const insertedCategory = await db.categories.get(newCategory.id);

    expect(insertedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                notes: expect.objectContaining({
                    ids: expect.arrayContaining([newNote.id])
                })
            })
        })
    );

    // Remove link
    await NoteController.deleteNotes([newNote.id]);
    const updatedCategory = await db.categories.get(newCategory.id);

    expect(updatedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                notes: expect.objectContaining({
                    ids: expect.arrayContaining([])
                })
            })
        })
    );

    done();
});

test("it returns an array of unique updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newNoteOne = new Note(seeded.user.id);
    const newNoteTwo = new Note(seeded.user.id);
    const newCategory = new Category(seeded.user.id);

    newNoteOne.relationships.category.id = newCategory.id;
    newNoteTwo.relationships.category.id = newCategory.id;
    newCategory.relationships.notes.ids.push(newNoteOne.id, newNoteTwo.id);

    await db.notes.bulkAdd([newNoteOne, newNoteTwo]);
    await db.categories.add(newCategory);

    // Remove link
    const deleted = await NoteController.deleteNotes([newNoteOne.id, newNoteTwo.id]);

    expect(deleted).toEqual(
        expect.objectContaining({
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({
                    id: newCategory.id,
                    relationships: expect.objectContaining({
                        notes: expect.objectContaining({
                            ids: expect.arrayContaining([])
                        })
                    })
                })
            ])
        })
    );
    expect(deleted.updatedCategories).toHaveLength(1);

    done();
})

test("it throws an error if any of the Notes do not exist", async done => {
    const seeded = await handler.seedTestDatabase();

    await expect(async () => {
        await NoteController.deleteNotes([seeded.notes[0].id, "bad-id"]);
    }).rejects.toThrow("Note does not exist.");

    done();
});

test("it throws an error if any of the Notes link non-existent Category ids", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);
    newNote.relationships.category.id = "bad-id";

    await db.notes.add(newNote);

    await expect(async () => {
        await NoteController.deleteNotes([newNote.id]);
    }).rejects.toThrow("Category does not exist.");

    done();
});