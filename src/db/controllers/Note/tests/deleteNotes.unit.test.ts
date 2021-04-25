import { db } from '../../../db';

import NoteController, { _NoteController } from '..';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an array of unique updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const linkedNoteOne = new Note(seeded.user.id);
    const linkedNoteTwo = new Note(seeded.user.id);
    const linkedCategory = new Category(seeded.user.id);

    linkedNoteOne.relationships.category.id = linkedCategory.id;
    linkedNoteTwo.relationships.category.id = linkedCategory.id;
    linkedCategory.relationships.notes.ids.push(linkedNoteOne.id, linkedNoteTwo.id);

    await db.notes.bulkAdd([linkedNoteOne, linkedNoteTwo]);
    await db.categories.add(linkedCategory);

    // Remove link
    const expectedCategory = linkedCategory;
    expectedCategory.relationships.notes.ids = [];

    const expectedResult = {
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await NoteController.deleteNotes([linkedNoteOne.id, linkedNoteTwo.id]);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls deleteNote as many times as the length of the id array", async done => {
    const noteIds = ["test-id-1", "test-id-2", "test-id-3"];

    const deleteFn = jest.fn(async () => {
        return {
            updatedCategories: []
        }
    });
    const selectFn = jest.fn();

    await _NoteController._deleteNotes(deleteFn, selectFn)(noteIds);

    expect(deleteFn.mock.calls).toEqual([
        ["test-id-1"], ["test-id-2"], ["test-id-3"]
    ]);

    done();
});

test("it does not call the select function by default", async done => {
    const noteIds = ["test-id-1", "test-id-2", "test-id-3"];

    const deleteFn = jest.fn(async () => {
        return {
            updatedCategories: []
        }
    });
    const selectFn = jest.fn();

    await _NoteController._deleteNotes(deleteFn, selectFn)(noteIds);

    expect(selectFn).not.toBeCalled();

    done();
});

test("it calls the select function once with the ids of any updated Categories", async done => {
    const noteIds = ["", "", ""];

    let count = 1;
    const deleteFn = jest.fn(async () => {
        const updatedCategory = new Category("");
        updatedCategory.id = `test-id-${count++}`;

        return {
            updatedCategories: [ updatedCategory ]
        }
    });
    const selectFn = jest.fn();

    await _NoteController._deleteNotes(deleteFn, selectFn)(noteIds);

    expect(selectFn.mock.calls).toEqual([
        ["categories", ["test-id-1", "test-id-2", "test-id-3"]]
    ]);

    done();
});