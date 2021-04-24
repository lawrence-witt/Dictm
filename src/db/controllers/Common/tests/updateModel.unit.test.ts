import { CommonController } from '..';

import * as handler from '../../../test/db-handler';
import { db } from '../../../db';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the model in the database", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedUser = Object.assign({}, seeded.user, { attributes: {name: "New Name"} });
    const expectedRecording = Object.assign({}, seeded.recordings[0], { attributes: {title: "New Title"} });
    const expectedNote = Object.assign({}, seeded.notes[0], { attributes: {title: "New Title"} });
    const expectedCategory = Object.assign({}, seeded.categories[0], { attributes: {title: "New Title"} });

    await CommonController.updateModel("users", expectedUser);
    await CommonController.updateModel("recordings", expectedRecording);
    await CommonController.updateModel("notes", expectedNote);
    await CommonController.updateModel("categories", expectedCategory);

    const actualUser = await db.users.get(expectedUser.id);
    const actualRecording = await db.recordings.get(expectedRecording.id);
    const actualNote = await db.notes.get(expectedNote.id);
    const actualCategory = await db.categories.get(expectedCategory.id);

    expect(actualUser).toEqual(expectedUser);
    expect(actualRecording).toEqual(expectedRecording);
    expect(actualNote).toEqual(expectedNote);
    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it returns the original and updated models", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedUserResult = {
        previous: seeded.user,
        current: Object.assign({}, seeded.user, { attributes: {name: "New Name"} })
    };
    const expectedRecordingResult = {
        previous: seeded.recordings[0],
        current: Object.assign({}, seeded.recordings[0], { attributes: {title: "New Title"} })
    };
    const expectedNoteResult = {
        previous: seeded.notes[0],
        current: Object.assign({}, seeded.notes[0], { attributes: {title: "New Title"} })
    }
    const expectedCategoryResult = {
        previous: seeded.categories[0],
        current: Object.assign({}, seeded.categories[0], { attributes: {title: "New Title"} })
    }

    const actualUserResult = await CommonController.updateModel("users", expectedUserResult.current);
    const actualRecordingResult = await CommonController.updateModel("recordings", expectedRecordingResult.current);
    const actualNoteResult = await CommonController.updateModel("notes", expectedNoteResult.current);
    const actualCategoryResult = await CommonController.updateModel("categories", expectedCategoryResult.current);

    expect(actualUserResult).toEqual(expectedUserResult);
    expect(actualRecordingResult).toEqual(expectedRecordingResult);
    expect(actualNoteResult).toEqual(expectedNoteResult);
    expect(actualCategoryResult).toEqual(expectedCategoryResult);

    done();
});

// This test passes, but bizarrely this specific error will not be correctly caught 
// and dexie prints it to console.warn...

/* test("it throws an error if supplied with mismatching parameters", async done => {
    const userWhichThrows = new User("New User", "") as any;

    await expect(async () => {
        await CommonController.updateModel("recordings", userWhichThrows);
    }).rejects.toThrow("Table recordings does not match model user.");

    done();
}); */

test("it throws an error if the model's id does not exist in its table", async done => {
    const seeded = await handler.seedTestDatabase();
    
    const recordingWhichThrows = seeded.recordings[0];
    recordingWhichThrows.id = "bad-id";

    await expect(async () => {
        await CommonController.updateModel("recordings", recordingWhichThrows);
    }).rejects.toThrow("Recording does not exist.");

    done();
});

test("it throws an error if the model is a Resource with non-existent User id", async done => {
    const seeded = await handler.seedTestDatabase();
    
    const noteWhichThrows = seeded.notes[0];
    noteWhichThrows.relationships.user.id = "bad-id";

    await expect(async () => {
        await CommonController.updateModel("notes", noteWhichThrows);
    }).rejects.toThrow("User does not exist.");

    done();
});