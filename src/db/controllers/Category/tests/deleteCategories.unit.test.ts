import { db } from '../../../db';

import CategoryController, { _CategoryController } from '..';
import Recording from '../../../models/Recording';
import Note from '../../../models/Note';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing all updated Media models", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const linkedCategoryOne = seeded.categories[0];
    const linkedCategoryTwo = seeded.categories[1];
    const linkedRecording = seeded.recordings[0];
    const linkedNote = seeded.notes[0];

    linkedCategoryOne.relationships.notes.ids = [linkedNote.id];
    linkedCategoryTwo.relationships.recordings.ids = [linkedRecording.id];
    linkedNote.relationships.category.id = linkedCategoryOne.id;
    linkedRecording.relationships.category.id = linkedCategoryTwo.id;

    await db.categories.bulkPut([linkedCategoryOne, linkedCategoryTwo]);
    await db.recordings.put(linkedRecording)
    await db.notes.put(linkedNote);

    // Remove link
    const expectedRecording = linkedRecording;
    const expectedNote = linkedNote;
    expectedRecording.relationships.category.id = undefined;
    expectedNote.relationships.category.id = undefined;

    const expectedResult = {
        updatedRecordings: [ expectedRecording ],
        updatedNotes: [ expectedNote ]
    }

    const actualResult = await CategoryController.deleteCategories([linkedCategoryOne.id, linkedCategoryTwo.id]);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls deleteCategory as many times as the length of the id array", async done => {
    const categoryIds = ["test-id-1", "test-id-2", "test-id-3"];

    const deleteFn = jest.fn(async () => {
        return {
            updatedRecordings: [],
            updatedNotes: []
        }
    });
    const selectFn = jest.fn();

    await _CategoryController._deleteCategories(deleteFn, selectFn)(categoryIds);

    expect(deleteFn.mock.calls).toEqual([
        ["test-id-1"], ["test-id-2"], ["test-id-3"]
    ]);

    done();
});

test("it does not call selectModelsById by default", async done => {
    const categoryIds = ["test-id-1", "test-id-2", "test-id-3"];

    const deleteFn = jest.fn(async () => {
        return {
            updatedRecordings: [],
            updatedNotes: []
        }
    });
    const selectFn = jest.fn();

    await _CategoryController._deleteCategories(deleteFn, selectFn)(categoryIds);

    expect(selectFn).not.toBeCalled();

    done();
});

test("it calls selectModelsById once if deleted Categories linked Media of one type", async done => {
    const categoryIds = ["test-id-1", "test-id-2", "test-id-3"];

    let count = 1;
    const deleteFn = jest.fn(async () => {
        const updatedRecording = new Recording("");
        updatedRecording.id = `test-rec-id-${count}`;
        count++;

        return {
            updatedRecordings: [ updatedRecording ],
            updatedNotes: []
        }
    });
    const selectFn = jest.fn();

    await _CategoryController._deleteCategories(deleteFn, selectFn)(categoryIds);

    expect(selectFn.mock.calls).toEqual([
        ["recordings", ["test-rec-id-1", "test-rec-id-2", "test-rec-id-3"]]
    ]);

    done();
});

test("it calls selectModelsById twice if deleted Categories linked Media of two types", async done => {
    const categoryIds = ["test-id-1", "test-id-2", "test-id-3"];

    let count = 1;
    const deleteFn = jest.fn(async () => {
        const updatedRecording = new Recording("");
        updatedRecording.id = `test-rec-id-${count}`;
        const updatedNote = new Note("");
        updatedNote.id = `test-note-id-${count}`;
        count++;

        return {
            updatedRecordings: [ updatedRecording ],
            updatedNotes: [ updatedNote ]
        }
    });
    const selectFn = jest.fn();

    await _CategoryController._deleteCategories(deleteFn, selectFn)(categoryIds);

    expect(selectFn.mock.calls).toEqual([
        ["recordings", ["test-rec-id-1", "test-rec-id-2", "test-rec-id-3"]],
        ["notes", ["test-note-id-1", "test-note-id-2", "test-note-id-3"]]
    ]);

    done();
})