import { CommonController } from '..';

import * as handler from '../../../test/db-handler';
import { db } from '../../../db';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the category id of the Resource model in the database", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecording = seeded.recordings[0];
    expectedRecording.relationships.category.id = seeded.categories[0].id;

    await CommonController.updateMediaCategory("recordings", seeded.recordings[0].id, seeded.categories[0].id);
    const actualRecording = await db.recordings.get(expectedRecording.id);

    expect(actualRecording).toEqual(expectedRecording);

    done();
});

test("it returns the updated Resource model", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedNote = seeded.notes[0];
    expectedNote.relationships.category.id = seeded.categories[0].id;

    const actualNote = await CommonController.updateMediaCategory(
        "notes", seeded.notes[0].id, seeded.categories[0].id
    );

    expect(actualNote).toEqual(expectedNote);

    done();
});

test("it throws an error when attempting to modify a non-existent Resource", async done => {
    const seeded = await handler.seedTestDatabase();

    await expect(async () => {
        await CommonController.updateMediaCategory("notes", "bad-id", seeded.categories[0].id);
    }).rejects.toThrow("Note does not exist.");

    done();
});

test("it throws an error when attempting to add a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();

    await expect(async () => {
        await CommonController.updateMediaCategory("notes", seeded.notes[0].id, "bad-id");
    }).rejects.toThrow("Category does not exist.");

    done();
});