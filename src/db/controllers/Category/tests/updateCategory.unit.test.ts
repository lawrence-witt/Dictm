import { db } from '../../../db';

import { CategoryController } from '..';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it updates the Category model in the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];
    targetCategory.attributes.title = "Updated Title";

    await CategoryController.updateCategory(targetCategory);
    const retrieved = await db.categories.get(targetCategory.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            attributes: expect.objectContaining({
                title: "Updated Title"
            })
        })
    );

    done();
});

test("it updates any Media affected by the Category update", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];
    targetCategory.relationships.recordings.ids.push(targetRecording.id);
    targetCategory.relationships.notes.ids.push(targetNote.id);

    await CategoryController.updateCategory(targetCategory);
    const updatedRecording = await db.recordings.get(targetRecording.id);
    const updatedNote = await db.notes.get(targetNote.id);

    expect(updatedRecording).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    expect(updatedNote).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    done();
});

test("it updates any Categories affect by the Category update", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const targetCategory = seeded.categories[0];
    const targetRecording = seeded.recordings[0];
    targetCategory.relationships.recordings.ids.push(targetRecording.id);
    targetRecording.relationships.category.id = targetCategory.id;

    await db.categories.update(targetCategory.id, targetCategory);
    await db.recordings.update(targetRecording.id, targetRecording);
    const linkedCategory = await db.categories.get(targetCategory.id);

    expect(linkedCategory).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                recordings: expect.objectContaining({
                    ids: expect.arrayContaining([targetRecording.id])
                })
            })
        })
    );

    // Remove link
    const updatedCategory = seeded.categories[1];
    updatedCategory.relationships.recordings.ids.push(targetRecording.id);

    await CategoryController.updateCategory(updatedCategory);
    const unlinkedCategory = await db.categories.get(targetCategory.id);

    expect(unlinkedCategory).toEqual(
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

test("it returns an object containing all the updated Resources", async done => {
    const seeded = await handler.seedTestDatabase();

    const targetCategory = seeded.categories[0];
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];
    targetCategory.relationships.recordings.ids.push(targetRecording.id);
    targetCategory.relationships.notes.ids.push(targetNote.id);

    const updated = await CategoryController.updateCategory(targetCategory);

    expect(updated).toEqual(
        expect.objectContaining({
            updatedRecordings: expect.arrayContaining([
                expect.objectContaining({id: targetRecording.id})
            ]),
            updatedNotes: expect.arrayContaining([
                expect.objectContaining({id: targetNote.id})
            ]),
            updatedCategories: expect.arrayContaining([
                expect.objectContaining({id: targetCategory.id})
            ])
        })
    );

    expect(updated.updatedRecordings).toHaveLength(1);
    expect(updated.updatedNotes).toHaveLength(1);
    expect(updated.updatedCategories).toHaveLength(1);

    done();
});

test("it throws an error if the Category does not exist", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);

    await expect(async () => {
        await CategoryController.updateCategory(newCategory);
    }).rejects.toThrow("Category does not exist.");

    done();
});

test("it throws an error if the Category links a non-existent User id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];
    targetCategory.relationships.user.id = "bad-id";

    await expect(async () => {
        await CategoryController.insertCategory(targetCategory);
    }).rejects.toThrow("User does not exist.");

    done();
});

test("it throws an error if the Category links a non-existent Media id", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];
    targetCategory.relationships.recordings.ids.push("bad-id");

    await expect(async () => {
        await CategoryController.updateCategory(targetCategory);
    }).rejects.toThrow("Recording does not exist.");

    done();
})