import { RecordingController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the updated Recording and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecording = seeded.recordings[0];
    const expectedCategory = seeded.categories[0];
    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.recordings.ids.push(expectedRecording.id);

    const expectedResult = {
        recording: expectedRecording,
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await RecordingController.updateRecording(expectedRecording);

    expect(actualResult).toEqual(expectedResult);

    done();
});

// it calls updateModel once

// it does not call updateCategoryMedia by default

// it calls updateCategoryMedia once when a category is added

// it calls updateCategoryMedia once when a category is removed

// it calls updateCategoryMedia twice when a category is removed and another added