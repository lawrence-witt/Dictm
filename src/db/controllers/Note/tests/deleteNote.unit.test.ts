import { db } from '../../../db';

import { NoteController } from '..';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes the Note from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];

    const original = await db.notes.get(targetNote.id);
    await NoteController.deleteNote(targetNote.id);
    const retrieved = await db.notes.get(targetNote.id);

    expect(original).toBeInstanceOf(Note);
    expect(retrieved).toBeUndefined();

    done();
})

test("it updates a Category which linked the deleted Note", async done => {
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
    await NoteController.deleteNote(newNote.id);
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
})

test("it returns an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newNote = new Note(seeded.user.id);
    const newCategory = new Category(seeded.user.id);
    newNote.relationships.category.id = newCategory.id;
    newCategory.relationships.recordings.ids.push(newNote.id);

    await db.notes.add(newNote);
    await db.categories.add(newCategory);
    
    // Remove link
    const deleted = await NoteController.deleteNote(newNote.id);

    expect(deleted).toEqual(
        expect.objectContaining({
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({
                    id: newCategory.id
                })
            ])
        })
    )

    done();
})

test("it throws an error if the Note does not exist", async done => {
    await expect(async () => {
        await NoteController.deleteNote("bad-id");
    }).rejects.toThrow("Note does not exist.");

    done();
});

test("it throws an error if the Note links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);
    newNote.relationships.category.id = "bad-id";

    await db.notes.add(newNote);
    
    await expect(async () => {
        await NoteController.deleteNote(newNote.id);
    }).rejects.toThrow("Category does not exist.");

    done();
})