import Dexie from 'dexie';

import { CommonController } from '..';

import User from '../../../models/User'
import Recording from '../../../models/Recording';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';
import { db } from '../../../db';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it inserts the model into the database", async done => {
    const expectedUser = new User("New User", "");
    const expectedRecording = new Recording(expectedUser.id);
    const expectedNote = new Note(expectedUser.id);
    const expectedCategory = new Category(expectedUser.id);

    await CommonController.insertModel("users", expectedUser);
    await CommonController.insertModel("recordings", expectedRecording);
    await CommonController.insertModel("notes", expectedNote);
    await CommonController.insertModel("categories", expectedCategory);

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

test("it returns the inserted model", async done => {
    const expectedUser = new User("New User", "");
    const expectedRecording = new Recording(expectedUser.id);
    const expectedNote = new Note(expectedUser.id);
    const expectedCategory = new Category(expectedUser.id);

    const actualUser = await CommonController.insertModel("users", expectedUser);
    const actualRecording = await CommonController.insertModel("recordings", expectedRecording);
    const actualNote = await CommonController.insertModel("notes", expectedNote);
    const actualCategory = await CommonController.insertModel("categories", expectedCategory);

    expect(actualUser).toEqual(expectedUser);
    expect(actualRecording).toEqual(expectedRecording);
    expect(actualNote).toEqual(expectedNote);
    expect(actualCategory).toEqual(expectedCategory);

    done();
});

// This test passes, but bizarrely this specific error will not be correctly caught 
// and dexie prints it to console.warn...

/* test("it throws an error if supplied with mismatching parameters", async done => {
    const userWhichThrows = new User("New User", "") as any;

    await expect(async () => {
        await CommonController.insertModel("recordings", userWhichThrows);
    }).rejects.toThrow("Table recordings does not match model user.");

    done();
}); */

test("it throws an error if the model has an id already in its table", async done => {
    const seeded = await handler.seedTestDatabase();

    const noteWhichThrows = new Note(seeded.user.id);
    noteWhichThrows.id = seeded.notes[0].id;

    await expect(async () => {
        await CommonController.insertModel("notes", noteWhichThrows);
    }).rejects.toThrow(Dexie.ConstraintError);

    done();
})

test("it throws an error if the model is a Resource with non-existent User id", async done => {
    const recordingWhichThrows = new Recording("bad-id");

    await expect(async () => {
        await CommonController.insertModel("recordings", recordingWhichThrows);
    }).rejects.toThrow("User does not exist.");

    done();
})