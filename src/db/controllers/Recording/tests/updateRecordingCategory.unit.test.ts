import { db } from '../../../db';

import { RecordingController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the Category id for a Recording model", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    const targetCategory = seeded.categories[0];

    await RecordingController.updateRecordingCategory(targetRecording.id, targetCategory.id);
    const retrieved = await db.recordings.get(targetRecording.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    done();
})

test("it returns the updated Recording", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    const targetCategory = seeded.categories[0];

    const inserted = await RecordingController.updateRecordingCategory(targetRecording.id, targetCategory.id);

    expect(inserted).toEqual(
        expect.objectContaining({
            id: targetRecording.id,
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    done();
})

test("it throws an error if the Recording does not exist", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];

    await expect(async () => {
        await RecordingController.updateRecordingCategory("bad-id", targetCategory.id);
    }).rejects.toThrow("Recording does not exist.");

    done();
});

test("it throws an error if the Recording links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];

    await expect(async () => {
        await RecordingController.updateRecordingCategory(targetRecording.id, "bad-id");
    }).rejects.toThrow("Category does not exist.");

    done();
});