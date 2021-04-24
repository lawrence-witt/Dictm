import Recording from '../../../models/Recording';
import { RecordingController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the inserted Recording and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecording = new Recording(seeded.user.id);
    const expectedCategory = seeded.categories[0];
    expectedRecording.relationships.category.id = expectedCategory.id;
    expectedCategory.relationships.recordings.ids.push(expectedRecording.id);

    const expectedResult = {
        recording: expectedRecording,
        updatedCategories: [ expectedCategory ]
    };

    const actualResult = await RecordingController.insertRecording(expectedRecording);

    expect(actualResult).toEqual(expectedResult);

    done();
});

// it calls insertModel once

// it does not call updateCategoryMedia by default

// it calls updateCategoryMedia once when linked with a Category