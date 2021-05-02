import { CommonController } from '..';

import * as handler from '../../../test/db-handler';
import { db } from '../../../db';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes the models from the database", async done => {
    const seeded = await handler.seedTestDatabase();

    expect(seeded.recordings).toHaveLength(3)

    const expectedRecordings: any[] = [];
    await CommonController.deleteModelsByUserId("recordings", seeded.user.id);
    const actualRecordings = await db.recordings.where({"relationships.user.id": seeded.user.id}).toArray();

    expect(actualRecordings).toEqual(expectedRecordings);

    done();
});

test("it returns the deleted models", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedNotes = await db.notes.where({"relationships.user.id": seeded.user.id}).toArray();
    const actualNotes = await CommonController.deleteModelsByUserId("notes", seeded.user.id);

    expect(actualNotes).toEqual(expectedNotes);

    done();
});

test("it throws an error if the user does not exist", async done => {
    await expect(async () => {
        await CommonController.deleteModelsByUserId("recordings", "bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
});