import { db } from '../../../db';

import UserController from '..';

import User from '../../../models/User';
import Recording from '../../../models/Recording';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns undefined", async done => {
    const seeded = await handler.seedTestDatabase();

    const result = await UserController.repairUserData(seeded.user.id);

    expect(result).toBeUndefined();

    done();
});

test("it sets a Media model's category id to undefined when Category does not exist", async done => {
    // Set up link
    const testUser = new User("", "");
    const testRecording = new Recording(testUser.id);

    testRecording.relationships.category.id = "non-existent-id";

    await db.users.add(testUser);
    await db.recordings.add(testRecording);

    // Remove link
    const expectedRecording = testRecording;
    expectedRecording.relationships.category.id = undefined;

    await UserController.repairUserData(testUser.id);

    const actualRecording = await db.recordings.get(expectedRecording.id);

    expect(actualRecording).toEqual(expectedRecording);

    done();
})

test("it sets a Media model's category id to undefined when Category does not link it", async done => {
    // Set up link
    const testUser = new User("", "");
    const testNote = new Note(testUser.id);
    const testCategory = new Category(testUser.id);

    testNote.relationships.category.id = testCategory.id;

    await db.users.add(testUser);
    await db.notes.add(testNote);
    await db.categories.add(testCategory);

    // Remove link
    const expectedNote = testNote;
    testNote.relationships.category.id = undefined;

    await UserController.repairUserData(testUser.id);

    const actualNote = await db.notes.get(expectedNote.id);

    expect(actualNote).toEqual(expectedNote);

    done();
});

test("it removes a media id from a Category model when Media does not exist", async done => {
    // Set up link
    const testUser = new User("", "");
    const testCategory = new Category(testUser.id);

    testCategory.relationships.notes.ids = ["non-existent-id-one", "non-existent-id-two"];

    await db.users.add(testUser);
    await db.categories.add(testCategory);

    // Remove link
    const expectedCategory = testCategory;
    expectedCategory.relationships.notes.ids = [];

    await UserController.repairUserData(testUser.id);

    const actualCategory = await db.categories.get(expectedCategory.id);

    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it removes a media id from a Category model when Media does not link it", async done => {
    // Set up link
    const testUser = new User("", "");
    const testRecordingOne = new Recording(testUser.id);
    const testRecordingTwo = new Recording(testUser.id);
    const testCategory = new Category(testUser.id);

    testCategory.relationships.recordings.ids = [testRecordingOne.id, testRecordingTwo.id];

    await db.users.add(testUser);
    await db.recordings.bulkAdd([testRecordingOne, testRecordingTwo]);
    await db.categories.add(testCategory);

    // Remove link
    const expectedCategory = testCategory;
    expectedCategory.relationships.recordings.ids = [];

    await UserController.repairUserData(testUser.id);

    const actualCategory = await db.categories.get(expectedCategory.id);

    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it does not make any changes to valid relationship links", async done => {
    // Set up links
    const testUser = new User("", "");
    const expectedRecording = new Recording(testUser.id);
    const expectedNote = new Note(testUser.id);
    const expectedCategory = new Category(testUser.id);

    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedNote.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.recordings.ids = [expectedRecording.id];
    expectedCategory.relationships.notes.ids = [expectedNote.id];

    await db.users.add(testUser);
    await db.recordings.add(expectedRecording);
    await db.notes.add(expectedNote);
    await db.categories.add(expectedCategory);

    // Test links
    await UserController.repairUserData(testUser.id);

    const actualRecording = await db.recordings.get(expectedRecording.id);
    const actualNote = await db.notes.get(expectedNote.id);
    const actualCategory = await db.categories.get(expectedCategory.id);

    expect(actualRecording).toEqual(expectedRecording);
    expect(actualNote).toEqual(expectedNote);
    expect(actualCategory).toEqual(expectedCategory);

    done();
});