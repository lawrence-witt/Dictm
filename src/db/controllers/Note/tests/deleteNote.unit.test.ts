import { db } from '../../../db';

import NoteController, { _NoteController } from '..';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const linkedNote = new Note(seeded.user.id);
    const linkedCategory = new Category(seeded.user.id);
    linkedNote.relationships.category.id = linkedCategory.id;
    linkedCategory.relationships.recordings.ids.push(linkedNote.id);

    await db.notes.add(linkedNote);
    await db.categories.add(linkedCategory);
    
    // Remove link
    const expectedCategory = linkedCategory;
    expectedCategory.relationships.notes.ids = [];

    const expectedResult = {
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await NoteController.deleteNote(linkedNote.id);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the deleteModel function once", async done => {
    const deletedNote = new Note("");

    const deleteFn = jest.fn(async () => deletedNote);
    const updateCategoryFn = jest.fn();

    await _NoteController._deleteNote(deleteFn, updateCategoryFn)(deletedNote.id);

    expect(deleteFn.mock.calls).toEqual([
        ["notes", deletedNote.id]
    ]);

    done();
});


test("it does not call the updateCategoryMedia function by default", async done => {
    const deletedNote = new Note("");

    const deleteFn = jest.fn(async () => deletedNote);
    const updateCategoryFn = jest.fn();

    await _NoteController._deleteNote(deleteFn, updateCategoryFn)(deletedNote.id);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updatedCategoryMedia function once when a Category was linked", async done => {
    const deletedNote = new Note("");
    deletedNote.relationships.category.id = "test-id";

    const deleteFn = jest.fn(async () => deletedNote);
    const updateCategoryFn = jest.fn();

    await _NoteController._deleteNote(deleteFn, updateCategoryFn)(deletedNote.id);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", "test-id", [], [deletedNote.id]]
    ]);

    done();
});