import { db } from '../../../db';

import { RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an object containing an array of unique updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newRecordingOne = new Recording(seeded.user.id);
    const newRecordingTwo = new Recording(seeded.user.id);
    const newCategory = new Category(seeded.user.id);

    newRecordingOne.relationships.category.id = newCategory.id;
    newRecordingTwo.relationships.category.id = newCategory.id;
    newCategory.relationships.recordings.ids.push(newRecordingOne.id, newRecordingTwo.id);

    await db.recordings.bulkAdd([newRecordingOne, newRecordingTwo]);
    await db.categories.add(newCategory);

    // Remove link
    const deleted = await RecordingController.deleteRecordings([newRecordingOne.id, newRecordingTwo.id]);

    expect(deleted).toEqual(
        expect.objectContaining({
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({
                    id: newCategory.id,
                    relationships: expect.objectContaining({
                        recordings: expect.objectContaining({
                            ids: expect.arrayContaining([])
                        })
                    })
                })
            ])
        })
    );
    expect(deleted.updatedCategories).toHaveLength(1);

    done();
})

// it calls deleteRecording as many times as the length of the id array