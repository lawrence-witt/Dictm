import { db } from '../../../db';

import { NoteController } from '..';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the Note model in the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    targetNote.attributes.title = "Updated Title";

    await NoteController.updateNote(targetNote);
    const retrieved = await db.notes.get(targetNote.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            attributes: expect.objectContaining({
                title: "Updated Title"
            })
        })
    );

    done();
});

test("it updates a Category the Note has been added to", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    const targetCategory = seeded.categories[0];
    targetNote.relationships.category.id = targetCategory.id;

    await NoteController.updateNote(targetNote);
    const updatedCategory = await db.categories.get(targetCategory.id);

    expect(updatedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                notes: expect.objectContaining({
                    ids: expect.arrayContaining([targetNote.id])
                })
            })
        })
    );

    done();
});

test("it updates a Category the Note has been removed from", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newRecording = new Note(seeded.user.id);
    const newCategory = new Category(seeded.user.id);
    newRecording.relationships.category.id = newCategory.id;
    newCategory.relationships.notes.ids.push(newRecording.id);

    await db.notes.add(newRecording);
    await db.categories.add(newCategory);
    const insertedCategory = await db.categories.get(newCategory.id);

    expect(insertedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                notes: expect.objectContaining({
                    ids: expect.arrayContaining([newRecording.id])
                })
            })
        })
    );

    // Remove link
    newRecording.relationships.category.id = undefined;
    await NoteController.updateNote(newRecording);
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

test("it returns the updated Note and an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    const targetCategory = seeded.categories[0];
    targetNote.relationships.category.id = targetCategory.id;

    const updated = await NoteController.updateNote(targetNote);

    expect(updated).toEqual(
        expect.objectContaining({
            note: expect.objectContaining({
                id: targetNote.id
            }),
            updatedCategories: expect.arrayContaining(
                [expect.objectContaining({
                    id: targetCategory.id
                })]
            )
        })
    );

    done();
});

test("it throws an error if the Note does not exist", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Note(seeded.user.id);

    await expect(async () => {
        await NoteController.updateNote(newRecording);
    }).rejects.toThrow("Note does not exist.");

    done();
});

test("it throws an error if the Note links a non-existent User id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    targetNote.relationships.user.id = "bad-id";

    await expect(async () => {
        await NoteController.updateNote(targetNote);
    }).rejects.toThrow("User does not exist.");

    done();
});

test("it throws an error if the Note links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    targetNote.relationships.category.id = "bad-id";

    await expect(async () => {
        await NoteController.updateNote(targetNote);
    }).rejects.toThrow("Category does not exist.");

    done();
});