import { CommonController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the specified model of a particular type", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedUser = seeded.user;
    const expectedRecording = seeded.recordings[0];
    const expectedNote = seeded.notes[0];
    const expectedCategory = seeded.categories[0];

    const actualUser = await CommonController.selectModelById("users", seeded.user.id);
    const actualRecording = await CommonController.selectModelById("recordings", seeded.recordings[0].id);
    const actualNote = await CommonController.selectModelById("notes", seeded.notes[0].id);
    const actualCategory = await CommonController.selectModelById("categories", seeded.categories[0].id);

    expect(actualUser).toEqual(expectedUser);
    expect(actualRecording).toEqual(expectedRecording);
    expect(actualNote).toEqual(expectedNote);
    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it throws an error when the model does not exist", async done => {
    await expect(async () => {
        await CommonController.selectModelById("users", "bad-id");
    }).rejects.toThrow("User does not exist.");

    await expect(async () => {
        await CommonController.selectModelById("recordings", "bad-id");
    }).rejects.toThrow("Recording does not exist.");

    await expect(async () => {
        await CommonController.selectModelById("notes", "bad-id");
    }).rejects.toThrow("Note does not exist.");

    await expect(async () => {
        await CommonController.selectModelById("categories", "bad-id");
    }).rejects.toThrow("Category does not exist.");

    done();
})