import Dexie from 'dexie';

import { db } from '../../../db';

import Note from '../../../models/Note';
import { NoteController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it inserts a new Note model into the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);

    await NoteController.insertNote(newNote);
    const retrieved = await db.notes.get(newNote.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            id: newNote.id
        })
    );

    done();
});

test("it updates any Categories affected by the insertion", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);
    const targetCategory = seeded.categories[0];
    newNote.relationships.category.id = targetCategory.id;

    await NoteController.insertNote(newNote);
    const updatedCategory = await db.categories.get(targetCategory.id);

    expect(updatedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                notes: expect.objectContaining({
                    ids: expect.arrayContaining([newNote.id])
                })
            })
        })
    );

    done();
});

test("it returns the inserted Note and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);
    const targetCategory = seeded.categories[0];
    newNote.relationships.category.id = targetCategory.id;

    const inserted = await NoteController.insertNote(newNote);

    expect(inserted).toEqual(
        expect.objectContaining({
            note: expect.objectContaining({id: newNote.id}),
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({id: targetCategory.id})
            ])
        })
    );
    expect(inserted.updatedCategories).toHaveLength(1);

    done();
});

test("it throws an error if the new Note's id is already in the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);
    newNote.id = seeded.notes[0].id;

    await expect(async () => {
        await NoteController.insertNote(newNote);
    }).rejects.toThrow(Dexie.ConstraintError);

    done();
})

test("it throws an error if the Note links a non-existent User id", async done => {
    const newNote = new Note("bad-id");

    await expect(async () => {
        await NoteController.insertNote(newNote);
    }).rejects.toThrow("User does not exist.");

    done();
});

test("it throws an error if the Note links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const newNote = new Note(seeded.user.id);
    newNote.relationships.category.id = "bad-id";

    await expect(async () => {
        await NoteController.insertNote(newNote);
    }).rejects.toThrow("Category does not exist.");

    done();
})