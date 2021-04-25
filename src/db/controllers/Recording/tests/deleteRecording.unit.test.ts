import { db } from '../../../db';

import RecordingController, { _RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const linkedRecording = new Recording(seeded.user.id);
    const linkedCategory = new Category(seeded.user.id);
    linkedRecording.relationships.category.id = linkedCategory.id;
    linkedCategory.relationships.recordings.ids.push(linkedRecording.id);

    await db.recordings.add(linkedRecording);
    await db.categories.add(linkedCategory);
    
    // Remove link
    const expectedCategory = linkedCategory;
    expectedCategory.relationships.recordings.ids = [];

    const expectedResult = {
        updatedCategories: [ expectedCategory ]
    };
    
    const actualResult = await RecordingController.deleteRecording(linkedRecording.id);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the deleteModel function once", async done => {
    const deletedRecording = new Recording("");

    const deleteFn = jest.fn((table: string, id: string): any => {
        return deletedRecording;
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._deleteRecording(deleteFn, updateCategoryFn)(deletedRecording.id);

    expect(deleteFn.mock.calls).toEqual([
        ["recordings", deletedRecording.id]
    ]);

    done();
});


test("it does not call the updateCategoryMedia function by default", async done => {
    const deletedRecording = new Recording("");

    const deleteFn = jest.fn((table: string, id: string): any => {
        return deletedRecording;
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._deleteRecording(deleteFn, updateCategoryFn)(deletedRecording.id);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updatedCategoryMedia function once when a Category was linked", async done => {
    const deletedRecording = new Recording("");
    deletedRecording.relationships.category.id = "test-id";

    const deleteFn = jest.fn((table: string, id: string): any => {
        return deletedRecording;
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._deleteRecording(deleteFn, updateCategoryFn)(deletedRecording.id);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", "test-id", [deletedRecording.id], []]
    ]);

    done();
});