import { CommonController } from '..';

import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';
import { db } from '../../../db';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test('it adds Resource ids to the Category in the database when method is "add"', async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedCategory = seeded.categories[0];
    const addedRecordings = [seeded.recordings[1].id, seeded.recordings[2].id];
    const addedNotes = [seeded.notes[0].id, seeded.notes[2].id]
    expectedCategory.relationships.recordings.ids.push(...addedRecordings);
    expectedCategory.relationships.notes.ids.push(...addedNotes);

    await CommonController.updateCategoryMedia("add", expectedCategory.id, addedRecordings, addedNotes);
    const actualCategory = await db.categories.get(expectedCategory.id);

    expect(actualCategory).toEqual(expectedCategory);

    done();
})

test('it removes Resource ids from the Category in the database when method is "remove"', async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up links
    const initialCategory = new Category(seeded.user.id);
    const recordingIds = [seeded.recordings[0].id, seeded.recordings[2].id];
    const noteIds = [seeded.notes[1].id, seeded.notes[2].id];
    initialCategory.relationships.recordings.ids.push(...recordingIds);
    initialCategory.relationships.notes.ids.push(...noteIds);

    await db.categories.add(initialCategory);
    const linkedCategory = await db.categories.get(initialCategory.id);

    expect(linkedCategory).toEqual(initialCategory);

    // Remove links
    const expectedCategory = initialCategory;
    expectedCategory.relationships.recordings.ids = [];
    expectedCategory.relationships.notes.ids = [];

    await CommonController.updateCategoryMedia("remove", expectedCategory.id, recordingIds, noteIds);
    const actualCategory = await db.categories.get(expectedCategory.id);

    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it returns the updated Category", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedCategory = seeded.categories[0];
    const addedRecordings = [seeded.recordings[1].id, seeded.recordings[2].id];
    const addedNotes = [seeded.notes[0].id, seeded.notes[2].id]
    expectedCategory.relationships.recordings.ids.push(...addedRecordings);
    expectedCategory.relationships.notes.ids.push(...addedNotes);

    const actualCategory = await CommonController.updateCategoryMedia(
        "add", expectedCategory.id, addedRecordings, addedNotes
    );

    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it still works when no Resource ids are provided", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedCategory = seeded.categories[0];

    const actualCategory = await CommonController.updateCategoryMedia("add", expectedCategory.id, [], []);

    expect(actualCategory).toEqual(expectedCategory);

    done();
});

test("it throws an error when attempting to modify a non-existent Category", async done => {
    await expect(async () => {
        await CommonController.updateCategoryMedia("add", "bad-id", [], []);
    }).rejects.toThrow("Category does not exist.");

    done();
});

test("it throws an error when attempting to add a non-existent Resource id", async done => {
    const seeded = await handler.seedTestDatabase();

    await expect(async () => {
        await CommonController.updateCategoryMedia("add", seeded.categories[0].id, ["bad-id"], []);
    }).rejects.toThrow("Recording does not exist.");

    done();
});