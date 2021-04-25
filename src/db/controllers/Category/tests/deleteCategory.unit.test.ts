import { db } from '../../../db';

import CategoryController, { _CategoryController } from '..';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing any updated Media", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up links
    const linkedCategory = seeded.categories[0];
    const linkedRecording = seeded.recordings[0];
    const linkedNote = seeded.notes[0];

    linkedCategory.relationships.notes.ids = [linkedNote.id];
    linkedCategory.relationships.recordings.ids = [linkedRecording.id];
    linkedRecording.relationships.category.id = linkedCategory.id;
    linkedNote.relationships.category.id = linkedCategory.id;

    await db.categories.update(linkedCategory.id, linkedCategory);
    await db.recordings.update(linkedRecording.id, linkedRecording);
    await db.notes.update(linkedNote.id, linkedNote);

    // Remove links
    const expectedRecording = linkedRecording;
    const expectedNote = linkedNote;
    expectedRecording.relationships.category.id = undefined;
    expectedNote.relationships.category.id = undefined;

    const expectedResult = {
        updatedRecordings: [ expectedRecording ],
        updatedNotes: [ expectedNote ]
    };

    const actualResult = await CategoryController.deleteCategory(linkedCategory.id);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the deleteModel function once", async done => {
    const deletedCategory = new Category("");

    const deleteFn = jest.fn(async () => deletedCategory);
    const updateMediaFn = jest.fn();

    await _CategoryController._deleteCategory(deleteFn, updateMediaFn)(deletedCategory.id);

    expect(deleteFn.mock.calls).toEqual([
        ["categories", deletedCategory.id]
    ]);

    done();
});

test("it does not call the updateMediaCategory function by default", async done => {
    const deletedCategory = new Category("");

    const deleteFn = jest.fn(async () => deletedCategory);
    const updateMediaFn = jest.fn();

    await _CategoryController._deleteCategory(deleteFn, updateMediaFn)(deletedCategory.id);

    expect(updateMediaFn).not.toBeCalled();

    done();
});

test("it calls the updateMediaCategory function once for every Media id on the deleted Category", async done => {
    const deletedCategory = new Category("");
    deletedCategory.relationships.recordings.ids = ["test-rec-id-1", "test-rec-id-2"];
    deletedCategory.relationships.notes.ids = ["test-note-id-2"];

    const deleteFn = jest.fn(async () => deletedCategory);
    const updateMediaFn = jest.fn();

    await _CategoryController._deleteCategory(deleteFn, updateMediaFn)(deletedCategory.id);

    expect(updateMediaFn.mock.calls).toEqual([
        ["recordings", "test-rec-id-1", undefined],
        ["recordings", "test-rec-id-2", undefined],
        ["notes", "test-note-id-2", undefined]
    ]);

    done();
});