import { db } from '../../../db';

import { RecordingController } from '..';
import Recording from '../../../models/Recording';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes the Recording from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetRecording = seeded.recordings[0];

    const original = await db.recordings.get(targetRecording.id);
    await RecordingController.deleteRecording(targetRecording.id);
    const retrieved = await db.recordings.get(targetRecording.id);

    expect(original).toBeInstanceOf(Recording);
    expect(retrieved).toBeUndefined();

    done();
})

test("it updates a Category which linked the deleted Recording", async done => {
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
    await RecordingController.deleteRecording(newRecording.id);
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
})

test("it returns an array of updated Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const newRecording = new Recording(seeded.user.id);
    const newCategory = new Category(seeded.user.id);
    newRecording.relationships.category.id = newCategory.id;
    newCategory.relationships.recordings.ids.push(newRecording.id);

    await db.recordings.add(newRecording);
    await db.categories.add(newCategory);
    
    // Remove link
    const deleted = await RecordingController.deleteRecording(newRecording.id);

    expect(deleted).toEqual(
        expect.objectContaining({
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({
                    id: newCategory.id
                })
            ])
        })
    )

    done();
})

test("it throws an error if the Recording does not exist", async done => {
    await expect(async () => {
        await RecordingController.deleteRecording("bad-id");
    }).rejects.toThrow("Recording does not exist.");

    done();
});

test("it throws an error if the Recording links a non-existent Category id", async done => {
    const seeded = await handler.seedTestDatabase();
    const newRecording = new Recording(seeded.user.id);
    newRecording.relationships.category.id = "bad-id";

    await db.recordings.add(newRecording);
    
    await expect(async () => {
        await RecordingController.deleteRecording(newRecording.id);
    }).rejects.toThrow("Category does not exist.");

    done();
})