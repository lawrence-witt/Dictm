import CategoryController, { _CategoryController } from '..';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing all the updated Resources", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedCategory = seeded.categories[0];
    const expectedRecording = seeded.recordings[0];
    const expectedNote = seeded.notes[0];

    expectedCategory.relationships.recordings.ids = [expectedRecording.id];
    expectedCategory.relationships.notes.ids = [expectedNote.id];
    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedNote.relationships.category.id = expectedCategory.id

    const expectedResult = {
        updatedRecordings: [ expectedRecording ],
        updatedNotes: [ expectedNote ],
        updatedCategories: [ expectedCategory ]
    }

    const actualResult = await CategoryController.updateCategory(expectedCategory);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the updateModel function once", async done => {
    const category = new Category("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(updateFn.mock.calls).toEqual([
        ["categories", category]
    ]);

    done();
});

test("it does not call the updateMediaCategory function by default", async done => {
    const category = new Category("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(updateMediaFn).not.toBeCalled();

    done();
});

test("it calls the updateMediaCategory function once for every Media id added or removed", async done => {
    const updatedCategory = new Category("");
    updatedCategory.relationships.recordings.ids = ["test-rec-id-1", "test-rec-id-2"];
    updatedCategory.relationships.notes.ids = ["test-note-id-1"];

    const updateFn = jest.fn(async (table: string, model: any) => {
        const previousCategory = new Category("");
        previousCategory.relationships.recordings.ids = ["test-rec-id-1"];
        previousCategory.relationships.notes.ids = ["test-note-id-1", "test-note-id-2"];

        return {
            previous: previousCategory,
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(updatedCategory);

    expect(updateMediaFn.mock.calls).toEqual([
        ["recordings", "test-rec-id-2", updatedCategory.id],
        ["notes", "test-note-id-2", undefined]
    ]);

    done();
});

test("it does not call the selectCategoriesByResourceIds function by default", async done => {
    const category = new Category("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(selectFn).not.toBeCalled();

    done();
});

test("it calls the selectCategoriesByResourceIds function once if Media ids have been changed", async done => {
    const updatedCategory = new Category("");
    updatedCategory.relationships.notes.ids = ["test-note-id-1"];

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: new Category(""),
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(updatedCategory);

    expect(selectFn.mock.calls).toEqual([
        [[], ["test-note-id-1"], [updatedCategory.id]]
    ]);

    done();
});

test("it does not call the updateCategoryMedia function by default", async done => {
    const category = new Category("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updateCategoryMedia function once for every Category the select function returns", async done => {
    const updatedCategory = new Category("");
    updatedCategory.relationships.recordings.ids = ["test-rec-id-1"];
    updatedCategory.relationships.notes.ids = ["test-note-id-1"];

    const expectedCategoryOne = new Category("");
    const expectedCategoryTwo = new Category("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: new Category(""),
            current: model
        }
    });
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => [expectedCategoryOne, expectedCategoryTwo]);

    await _CategoryController._updateCategory(updateFn, updateMediaFn, updateCategoryFn, selectFn)(updatedCategory);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", expectedCategoryOne.id, ["test-rec-id-1"], ["test-note-id-1"]],
        ["remove", expectedCategoryTwo.id, ["test-rec-id-1"], ["test-note-id-1"]]
    ]);

    done();
});