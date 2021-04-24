import { CommonController } from '..';

import * as handler from '../../../test/db-handler';
import { db } from '../../../db';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes the model from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    
    const expectedUser = seeded.user;
    const expectedRecording = seeded.recordings[0];
    const expectedNote = seeded.notes[0];
    const expectedCategory = seeded.categories[0];

    await CommonController.deleteModel("users", expectedUser.id);
    await CommonController.deleteModel("recordings", expectedRecording.id);
    await CommonController.deleteModel("notes", expectedNote.id);
    await CommonController.deleteModel("categories", expectedCategory.id);

    const actualUser = await db.users.get(expectedUser.id);
    const actualRecording = await db.recordings.get(expectedRecording.id);
    const actualNote = await db.notes.get(expectedNote.id);
    const actualCategory = await db.categories.get(expectedCategory.id);
    
    expect(actualUser).toBeUndefined();
    expect(actualRecording).toBeUndefined();
    expect(actualNote).toBeUndefined();
    expect(actualCategory).toBeUndefined();
    
    done();
});

test("it returns the deleted model", async done => {
    const seeded = await handler.seedTestDatabase();
    
    const expectedUser = seeded.user;
    const expectedRecording = seeded.recordings[0];
    const expectedNote = seeded.notes[0];
    const expectedCategory = seeded.categories[0];

    const actualUser = await CommonController.deleteModel("users", expectedUser.id);
    const actualRecording = await CommonController.deleteModel("recordings", expectedRecording.id);
    const actualNote = await CommonController.deleteModel("notes", expectedNote.id);
    const actualCategory = await CommonController.deleteModel("categories", expectedCategory.id);
    
    expect(actualUser).toEqual(expectedUser);
    expect(actualRecording).toEqual(expectedRecording);
    expect(actualNote).toEqual(expectedNote);
    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it throws an error if the model's id does not exist in its table", async done => {
    await expect(async () => {
        await CommonController.deleteModel("recordings", "bad-id");
    }).rejects.toThrow("Recording does not exist.");

    done();
});