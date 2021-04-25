import { db } from '../../../db';

import RecordingController, { _RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing an array of unique updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const linkedRecordingOne = new Recording(seeded.user.id);
    const linkedRecordingTwo = new Recording(seeded.user.id);
    const linkedCategory = new Category(seeded.user.id);

    linkedRecordingOne.relationships.category.id = linkedCategory.id;
    linkedRecordingTwo.relationships.category.id = linkedCategory.id;
    linkedCategory.relationships.recordings.ids.push(linkedRecordingOne.id, linkedRecordingTwo.id);

    await db.recordings.bulkAdd([linkedRecordingOne, linkedRecordingTwo]);
    await db.categories.add(linkedCategory);

    // Remove link
    const expectedCategory = linkedCategory;
    expectedCategory.relationships.recordings.ids = [];

    const expectedResult = {
        updatedCategories: [ expectedCategory ]
    };
    
    const actualResult = await RecordingController.deleteRecordings([linkedRecordingOne.id, linkedRecordingTwo.id]);

    expect(actualResult).toEqual(expectedResult);

    done();
})

test("it calls deleteRecording as many times as the length of the id array", async done => {
    const recordingIds = ["test-id-1", "test-id-2", "test-id-3"];

    const deleteFn = jest.fn(async (id: string) => {
        return {
            updatedCategories: []
        }
    });
    const selectFn = jest.fn();

    await _RecordingController._deleteRecordings(deleteFn, selectFn)(recordingIds);

    expect(deleteFn.mock.calls).toEqual([
        ["test-id-1"], ["test-id-2"], ["test-id-3"]
    ]);

    done();
});

test("it does not call the select function by default", async done => {
    const recordingIds = ["test-id-1", "test-id-2", "test-id-3"];

    const deleteFn = jest.fn(async (id: string) => {
        return {
            updatedCategories: []
        }
    });
    const selectFn = jest.fn();

    await _RecordingController._deleteRecordings(deleteFn, selectFn)(recordingIds);

    expect(selectFn).not.toBeCalled();

    done();
});

test("it calls the select function once with the ids of any updated Categories", async done => {
    const recordingIds = ["", "", ""];

    let count = 1;
    const deleteFn = jest.fn(async (id: string) => {
        const updatedCategory = new Category("");
        updatedCategory.id = `test-id-${count++}`;

        return {
            updatedCategories: [ updatedCategory ]
        }
    });
    const selectFn = jest.fn();

    await _RecordingController._deleteRecordings(deleteFn, selectFn)(recordingIds);

    expect(selectFn.mock.calls).toEqual([
        ["categories", ["test-id-1", "test-id-2", "test-id-3"]]
    ]);

    done();
});