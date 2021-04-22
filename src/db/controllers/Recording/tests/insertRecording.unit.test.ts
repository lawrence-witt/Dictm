import Dexie from 'dexie';

import { db } from '../../../db';

import Recording from '../../../models/Recording';
import { RecordingController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it inserts a new Recording model into the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);

    await RecordingController.insertRecording(newRecording);
    const retrieved = await db.recordings.get(newRecording.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            id: newRecording.id
        })
    );

    done();
});

test("it updates any Categories affected by the insertion", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);
    const targetCategory = seeded.categories[0];
    newRecording.relationships.category.id = targetCategory.id;

    await RecordingController.insertRecording(newRecording);
    const updatedCategory = await db.categories.get(targetCategory.id);

    expect(updatedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                recordings: expect.objectContaining({
                    ids: expect.arrayContaining([newRecording.id])
                })
            })
        })
    );

    done();
});

test("it returns the inserted Recording and any updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);
    const targetCategory = seeded.categories[0];
    newRecording.relationships.category.id = targetCategory.id;

    const inserted = await RecordingController.insertRecording(newRecording);

    expect(inserted).toEqual(
        expect.objectContaining({
            recording: expect.objectContaining({id: newRecording.id}),
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({id: targetCategory.id})
            ])
        })
    );
    expect(inserted.updatedCategories).toHaveLength(1);

    done();
});

test("it throws an error if the Recording has an id already present in the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);
    newRecording.id = seeded.recordings[0].id;

    await expect(async () => {
        await RecordingController.insertRecording(newRecording);
    }).rejects.toThrow(Dexie.ConstraintError);

    done();
})

test("it throws an error if the Recording links a non-existent User id", async done => {
    const newRecording = new Recording("bad-id");

    await expect(async () => {
        await RecordingController.insertRecording(newRecording);
    }).rejects.toThrow("User does not exist.");

    done();
});

test("it throws an error if the Recording links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);
    newRecording.relationships.category.id = "bad-id";

    await expect(async () => {
        await RecordingController.insertRecording(newRecording);
    }).rejects.toThrow("Category does not exist.");

    done();
})