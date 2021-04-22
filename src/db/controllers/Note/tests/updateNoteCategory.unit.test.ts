import { db } from '../../../db';

import { NoteController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the Category id for a Note model", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    const targetCategory = seeded.categories[0];

    await NoteController.updateNoteCategory(targetNote.id, targetCategory.id);
    const retrieved = await db.notes.get(targetNote.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    done();
})

test("it returns the updated Note", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];
    const targetCategory = seeded.categories[0];

    const inserted = await NoteController.updateNoteCategory(targetNote.id, targetCategory.id);

    expect(inserted).toEqual(
        expect.objectContaining({
            id: targetNote.id,
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    done();
})

test("it throws an error if the Note does not exist", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];

    await expect(async () => {
        await NoteController.updateNoteCategory("bad-id", targetCategory.id);
    }).rejects.toThrow("Note does not exist.");

    done();
});

test("it throws an error if the Note links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetNote = seeded.notes[0];

    await expect(async () => {
        await NoteController.updateNoteCategory(targetNote.id, "bad-id");
    }).rejects.toThrow("Category does not exist.");

    done();
});