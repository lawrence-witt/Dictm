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

    await CommonController.deleteModelById("users", expectedUser.id);
    await CommonController.deleteModelById("recordings", expectedRecording.id);
    await CommonController.deleteModelById("notes", expectedNote.id);
    await CommonController.deleteModelById("categories", expectedCategory.id);

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

    const actualUser = await CommonController.deleteModelById("users", expectedUser.id);
    const actualRecording = await CommonController.deleteModelById("recordings", expectedRecording.id);
    const actualNote = await CommonController.deleteModelById("notes", expectedNote.id);
    const actualCategory = await CommonController.deleteModelById("categories", expectedCategory.id);
    
    expect(actualUser).toEqual(expectedUser);
    expect(actualRecording).toEqual(expectedRecording);
    expect(actualNote).toEqual(expectedNote);
    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it throws an error if the model's id does not exist in its table", async done => {
    await expect(async () => {
        await CommonController.deleteModelById("recordings", "bad-id");
    }).rejects.toThrow("Recording does not exist.");

    done();
});