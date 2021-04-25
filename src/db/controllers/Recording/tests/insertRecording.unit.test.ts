import RecordingController, { _RecordingController } from '..';
import Recording from '../../../models/Recording';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the inserted Recording and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecording = new Recording(seeded.user.id);
    const expectedCategory = seeded.categories[0];
    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.recordings.ids.push(expectedRecording.id);

    const expectedResult = {
        recording: expectedRecording,
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await RecordingController.insertRecording(expectedRecording);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the insertModel function once", async done => {
    const recording = new Recording("");

    const insertFn = jest.fn();
    const updateCategoryFn = jest.fn();

    await _RecordingController._insertRecording(insertFn, updateCategoryFn)(recording);

    expect(insertFn.mock.calls).toEqual([
        ["recordings", recording]
    ]);

    done();
});

test("it does not call the upateCategoryMedia function by default", async done => {
    const recording = new Recording("");

    const insertFn = jest.fn();
    const updateCategoryFn = jest.fn();

    await _RecordingController._insertRecording(insertFn, updateCategoryFn)(recording);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updatedCategoryMedia function once when linked with a Category", async done => {
    const recording = new Recording("");
    recording.relationships.category.id = "test-id";

    const insertFn = jest.fn();
    const updateCategoryFn = jest.fn();

    await _RecordingController._insertRecording(insertFn, updateCategoryFn)(recording);
    
    expect(updateCategoryFn.mock.calls).toEqual([
        ["add", "test-id", [recording.id], []]
    ]);

    done();
});