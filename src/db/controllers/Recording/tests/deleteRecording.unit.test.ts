import { db } from '../../../db';

import { RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const linkedRecording = new Recording(seeded.user.id);
    const linkedCategory = new Category(seeded.user.id);
    linkedRecording.relationships.category.id = linkedCategory.id;
    linkedCategory.relationships.recordings.ids.push(linkedRecording.id);

    await db.recordings.add(linkedRecording);
    await db.categories.add(linkedCategory);
    
    // Remove link
    const expectedCategory = linkedCategory;
    expectedCategory.relationships.recordings.ids = [];

    const expectedResult = {
        updatedCategories: [ expectedCategory ]
    };
    
    const actualResult = await RecordingController.deleteRecording(linkedRecording.id);

    expect(actualResult).toEqual(expectedResult);

    done();
})

// it calls deleteModel once

// it does not call upateCategoryMedia by default

// it calls updateCategoryMedia once when the deleted Recording linked a category