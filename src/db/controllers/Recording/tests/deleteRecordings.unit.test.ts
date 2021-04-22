import { db } from '../../../db';

import { RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes an array of Recordings from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const recordingIds = seeded.recordings.map(recording => recording.id);

    await RecordingController.deleteRecordings(recordingIds);
    const retrieved = await db.recordings.where("id").anyOf(recordingIds).toArray();

    expect(retrieved).toHaveLength(0);

    done();
});

test("it updates Categories which linked the deleted Recordings", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newRecording = new Recording(seeded.user.id);
    const newCategory = new Category(seeded.user.id);
    newRecording.relationships.category.id = newCategory.id;
    newCategory.relationships.recordings.ids.push(newRecording.id);

    await db.recordings.add(newRecording);
    await db.categories.add(newCategory);
    const insertedCategory = await db.categories.get(newCategory.id);

    expect(insertedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                recordings: expect.objectContaining({
                    ids: expect.arrayContaining([newRecording.id])
                })
            })
        })
    );

    // Remove link
    await RecordingController.deleteRecordings([newRecording.id]);
    const updatedCategory = await db.categories.get(newCategory.id);

    expect(updatedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                recordings: expect.objectContaining({
                    ids: expect.arrayContaining([])
                })
            })
        })
    );

    done();
});

test("it returns an array of unique updated Categories", async done => {
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

test("it throws an error if any of the Recordings do not exist", async done => {
    const seeded = await handler.seedTestDatabase();

    await expect(async () => {
        await RecordingController.deleteRecordings([seeded.recordings[0].id, "bad-id"]);
    }).rejects.toThrow("Recording does not exist.");

    done();
});

test("it throws an error if any of the Recordings link non-existent Category ids", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);
    newRecording.relationships.category.id = "bad-id";

    await db.recordings.add(newRecording);

    await expect(async () => {
        await RecordingController.deleteRecordings([newRecording.id]);
    }).rejects.toThrow("Category does not exist.");

    done();
});