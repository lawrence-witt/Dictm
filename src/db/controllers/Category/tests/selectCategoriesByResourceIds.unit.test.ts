import { db } from '../../../db';

import CategoryController from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

test("it selects the correct Category resources", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const expectedCategoryOne = seeded.categories[0];
    const expectedCategoryTwo = seeded.categories[1];
    const linkedRecording = seeded.recordings[0];
    const linkedNote = seeded.notes[0];
    
    expectedCategoryOne.relationships.recordings.ids.push(linkedRecording.id);
    expectedCategoryTwo.relationships.notes.ids.push(linkedNote.id);

    await db.categories.bulkPut([expectedCategoryOne, expectedCategoryTwo]);

    // Test link
    const expectedResult = [ expectedCategoryOne, expectedCategoryTwo ];

    const actualResult = await CategoryController.selectCategoriesByResourceIds(
        [linkedRecording.id],
        [linkedNote.id]
    );

    expect(actualResult).toEqual(expectedResult);

    done();
});

test("it excludes Categories from exclude array", async done => {
    const seeded = await handler.seedTestDatabase();
    
    // Set up link
    const expectedCategoryOne = seeded.categories[0];
    const expectedCategoryTwo = seeded.categories[1];
    const linkedRecording = seeded.recordings[0];
    const linkedNote = seeded.notes[0];
    
    expectedCategoryOne.relationships.recordings.ids.push(linkedRecording.id);
    expectedCategoryTwo.relationships.notes.ids.push(linkedNote.id);

    await db.categories.bulkPut([expectedCategoryOne, expectedCategoryTwo]);

    // Test link
    const expectedResult = [ expectedCategoryTwo ];

    const actualResult = await CategoryController.selectCategoriesByResourceIds(
        [linkedRecording.id],
        [linkedNote.id],
        [expectedCategoryOne.id]
    );

    expect(actualResult).toEqual(expectedResult);

    done();
})