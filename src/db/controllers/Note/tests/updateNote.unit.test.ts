import NoteController, { _NoteController } from '..';
import Note from '../../../models/Note';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the updated Note and an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();
    
    const expectedNote = seeded.notes[0];
    const expectedCategory = seeded.categories[0];
    expectedNote.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.notes.ids.push(expectedNote.id);

    const expectedResult = {
        note: expectedNote,
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await NoteController.updateNote(expectedNote);

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it calls the updateModel function once", async done => {
    const note = new Note("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _NoteController._updateNote(updateFn, updateCategoryFn)(note);

    expect(updateFn.mock.calls).toEqual([
        ["notes", note]
    ]);

    done();
});

test("it does not call the upateCategoryMedia function by default", async done => {
    const note = new Note("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: model,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _NoteController._updateNote(updateFn, updateCategoryFn)(note);

    expect(updateCategoryFn).not.toBeCalled();

    done();
});

test("it calls the updateCategoryMedia function once when a Category is added", async done => {
    const updatedNote = new Note("");
    updatedNote.relationships.category.id = "test-id";

    const updateFn = jest.fn(async (table: string, model: any) => {
        return {
            previous: new Note(""),
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _NoteController._updateNote(updateFn, updateCategoryFn)(updatedNote);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["add", "test-id", [], [updatedNote.id]]
    ]);
    
    done();
});

test("it calls the updateCategoryMedia function once when a Category is removed", async done => {
    const updatedNote = new Note("");

    const updateFn = jest.fn(async (table: string, model: any) => {
        const previousModel = new Note("");
        previousModel.relationships.category.id = "test-id";

        return {
            previous: previousModel,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _NoteController._updateNote(updateFn, updateCategoryFn)(updatedNote);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", "test-id", [], [updatedNote.id]]
    ]);
    
    done();
});

test("it calls the updateCategoryMedia function twice when a Category is removed and added", async done => {
    const updatedNote = new Note("");
    updatedNote.relationships.category.id = "test-id-2";

    const updateFn = jest.fn(async (table: string, model: any) => {
        const previousModel = new Note("");
        previousModel.relationships.category.id = "test-id-1";

        return {
            previous: previousModel,
            current: model
        }
    });
    const updateCategoryFn = jest.fn();

    await _NoteController._updateNote(updateFn, updateCategoryFn)(updatedNote);

    expect(updateCategoryFn.mock.calls).toEqual([
        ["remove", "test-id-1", [], [updatedNote.id]],
        ["add", "test-id-2", [], [updatedNote.id]]
    ]);
    
    done();
});