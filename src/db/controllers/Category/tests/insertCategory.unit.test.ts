import CategoryController, { _CategoryController } from '..';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing inserted Category and updated Resources", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedCategory = new Category(seeded.user.id);
    const expectedRecording = seeded.recordings[0];
    const expectedNote = seeded.notes[0];

    expectedCategory.relationships.recordings.ids.push(expectedRecording.id);
    expectedCategory.relationships.notes.ids.push(expectedNote.id);
    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedNote.relationships.category.id = expectedCategory.id;

    const expectedResult = {
        category: expectedCategory,
        updatedRecordings: [ expectedRecording ],
        updatedNotes: [ expectedNote ],
        updatedCategories: []
    }

    const actualResult = await CategoryController.insertCategory(expectedCategory);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the insertModel function once", async done => {
    const category = new Category("");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(insertFn.mock.calls).toEqual([
        ["categories", category]
    ]);

    done();
});

test("it does not call the updateMediaCategory function by default", async done => {
    const category = new Category("");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(updateMediaFn).not.toBeCalled();

    done();
});

test("it calls the updateMediaCategory function as many times as the Category has Media ids", async done => {
    const category = new Category("");
    category.relationships.recordings.ids.push("test-rec-id-1", "test-rec-id-2");
    category.relationships.notes.ids.push("test-note-id-1");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(updateMediaFn.mock.calls).toEqual([
        ["recordings", "test-rec-id-1", category.id],
        ["recordings", "test-rec-id-2", category.id],
        ["notes", "test-note-id-1", category.id]
    ]);

    done();
});

test("it does not call the selectCategoriesByResourceIds function by default", async done => {
    const category = new Category("");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(selectFn).not.toBeCalled();

    done();
});

test("it calls the selectCategoriesByResourceIds function once if the Category has any Media ids", async done => {
    const category = new Category("");
    category.relationships.recordings.ids.push("test-rec-id-1", "test-rec-id-2");
    category.relationships.notes.ids.push("test-note-id-1");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(selectFn.mock.calls).toEqual([
        [["test-rec-id-1", "test-rec-id-2"], ["test-note-id-1"], [category.id]]
    ]);

    done();
});

test("it does not call the updateCategoryMedia function by default", async done => {
    const category = new Category("");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => []);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(category);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updateCategoryMedia function once for every Category the select function returns", async done => {
    const insertedCategory = new Category("");
    insertedCategory.relationships.recordings.ids.push("test-rec-id-1");
    insertedCategory.relationships.notes.ids.push("test-note-id-1");

    const expectedCategoryOne = new Category("");
    const expectedCategoryTwo = new Category("");

    const insertFn = jest.fn();
    const updateMediaFn = jest.fn();
    const updateCategoryFn = jest.fn();
    const selectFn = jest.fn(async () => [expectedCategoryOne, expectedCategoryTwo]);

    await _CategoryController._insertCategory(insertFn, updateMediaFn, updateCategoryFn, selectFn)(insertedCategory);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", expectedCategoryOne.id, ["test-rec-id-1"], ["test-note-id-1"]],
        ["remove", expectedCategoryTwo.id, ["test-rec-id-1"], ["test-note-id-1"]]
    ]);

    done();
});