import { db } from '../../../db';

import { RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the Recording model in the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    targetRecording.attributes.title = "Updated Title";

    await RecordingController.updateRecording(targetRecording);
    const retrieved = await db.recordings.get(targetRecording.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            attributes: expect.objectContaining({
                title: "Updated Title"
            })
        })
    );

    done();
});

test("it updates a Category the Recording has been added to", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    const targetCategory = seeded.categories[0];
    targetRecording.relationships.category.id = targetCategory.id;

    await RecordingController.updateRecording(targetRecording);
    const updatedCategory = await db.categories.get(targetCategory.id);

    expect(updatedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                recordings: expect.objectContaining({
                    ids: expect.arrayContaining([targetRecording.id])
                })
            })
        })
    );

    done();
});

test("it updates a Category the Recording has been removed from", async done => {
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
    newRecording.relationships.category.id = undefined;
    await RecordingController.updateRecording(newRecording);
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

test("it returns the updated Recording and an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    const targetCategory = seeded.categories[0];
    targetRecording.relationships.category.id = targetCategory.id;

    const updated = await RecordingController.updateRecording(targetRecording);

    expect(updated).toEqual(
        expect.objectContaining({
            recording: expect.objectContaining({
                id: targetRecording.id
            }),
            updatedCategories: expect.arrayContaining(
                [expect.objectContaining({
                    id: targetCategory.id
                })]
            )
        })
    );

    done();
});

test("it throws an error if the Recording does not exist", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);

    await expect(async () => {
        await RecordingController.updateRecording(newRecording);
    }).rejects.toThrow("Recording does not exist.");

    done();
});

test("it throws an error if the Recording links a non-existent User id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    targetRecording.relationships.user.id = "bad-id";

    await expect(async () => {
        await RecordingController.updateRecording(targetRecording);
    }).rejects.toThrow("User does not exist.");

    done();
});

test("it throws an error if the Recording links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];
    targetRecording.relationships.category.id = "bad-id";

    await expect(async () => {
        await RecordingController.updateRecording(targetRecording);
    }).rejects.toThrow("Category does not exist.");

    done();
});