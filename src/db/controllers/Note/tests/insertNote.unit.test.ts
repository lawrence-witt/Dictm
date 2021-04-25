import NoteController, { _NoteController } from '..';
import Note from '../../../models/Note';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the inserted Note and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedNote = new Note(seeded.user.id);
    const expectedCategory = seeded.categories[0];
    expectedNote.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.notes.ids.push(expectedNote.id);

    const expectedResult = {
        note: expectedNote,
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await NoteController.insertNote(expectedNote);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the insertModel function once", async done => {
    const note = new Note("");

    const insertFn = jest.fn();
    const updateCategoryFn = jest.fn();

    await _NoteController._insertNote(insertFn, updateCategoryFn)(note);

    expect(insertFn.mock.calls).toEqual([
        ["notes", note]
    ]);

    done();
});

test("it does not call the upateCategoryMedia function by default", async done => {
    const note = new Note("");

    const insertFn = jest.fn();
    const updateCategoryFn = jest.fn();

    await _NoteController._insertNote(insertFn, updateCategoryFn)(note);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updatedCategoryMedia function once when linked with a Category", async done => {
    const note = new Note("");
    note.relationships.category.id = "test-id";

    const insertFn = jest.fn();
    const updateCategoryFn = jest.fn();

    await _NoteController._insertNote(insertFn, updateCategoryFn)(note);
    
    expect(updateCategoryFn.mock.calls).toEqual([
        ["add", "test-id", [], [note.id]]
    ]);

    done();
});