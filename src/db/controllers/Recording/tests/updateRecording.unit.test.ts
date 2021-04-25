import RecordingController, { _RecordingController } from '..';
import Recording from '../../../models/Recording';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the updated Recording and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecording = seeded.recordings[0];
    const expectedCategory = seeded.categories[0];
    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.recordings.ids.push(expectedRecording.id);

    const expectedResult = {
        recording: expectedRecording,
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await RecordingController.updateRecording(expectedRecording);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the updateModel function once", async done => {
    const recording = new Recording("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._updateRecording(updateFn, updateCategoryFn)(recording);

    expect(updateFn.mock.calls).toEqual([
        ["recordings", recording]
    ])

    done();
});

test("it does not call the upateCategoryMedia function by default", async done => {
    const recording = new Recording("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._updateRecording(updateFn, updateCategoryFn)(recording);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updateCategoryMedia function once when a Category is added", async done => {
    const updatedRecording = new Recording("");
    updatedRecording.relationships.category.id = "test-id";

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: new Recording(""),
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._updateRecording(updateFn, updateCategoryFn)(updatedRecording);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["add", "test-id", [updatedRecording.id], []]
    ]);
    
    done();
});

test("it calls the updateCategoryMedia function once when a Category is removed", async done => {
    const updatedRecording = new Recording("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        const previousModel = new Recording("");
        previousModel.relationships.category.id = "test-id";

        return {
            previous: previousModel,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._updateRecording(updateFn, updateCategoryFn)(updatedRecording);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", "test-id", [updatedRecording.id], []]
    ]);
    
    done();
});

test("it calls the updateCategoryMedia function twice when a Category is removed and added", async done => {
    const updatedRecording = new Recording("");
    updatedRecording.relationships.category.id = "test-id-2";

    const updateFn = jest.fn(async (table: string, model: any) => {
        const previousModel = new Recording("");
        previousModel.relationships.category.id = "test-id-1";

        return {
            previous: previousModel,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _RecordingController._updateRecording(updateFn, updateCategoryFn)(updatedRecording);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", "test-id-1", [updatedRecording.id], []],
        ["add", "test-id-2", [updatedRecording.id], []]
    ]);
    
    done();
});