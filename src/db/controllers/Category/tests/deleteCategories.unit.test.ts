import { db } from '../../../db';

import Category from '../../../models/Category';
import { CategoryController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes a list of Categories from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const categoryIds = seeded.categories.map(category => category.id);

    await CategoryController.deleteCategories(categoryIds);
    const retrieved = await db.categories.where("id").anyOf(categoryIds).toArray();

    expect(retrieved).toHaveLength(0);

    done();
});

test("it updates any Media which linked the deleted Categories", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const targetCategory = seeded.categories[0];
    const targetRecording = seeded.recordings[0];
    targetCategory.relationships.recordings.ids.push(targetRecording.id);
    targetRecording.relationships.category.id = targetCategory.id;

    await db.categories.update(targetCategory.id, targetCategory);
    await db.recordings.update(targetRecording.id, targetRecording);
    const linkedRecording = await db.recordings.get(targetRecording.id);

    expect(linkedRecording).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: targetCategory.id
                })
            })
        })
    );

    // Remove link
    await CategoryController.deleteCategories([targetCategory.id]);
    const unlinkedRecording = await db.recordings.get(targetRecording.id);

    expect(unlinkedRecording).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: undefined
                })
            })
        })
    );

    done();
});

test("it returns an object containing all updated Media models", async done => {
    const seeded = await handler.seedTestDatabase();

    // Set up link
    const targetCategoryOne = seeded.categories[0];
    const targetCategoryTwo = seeded.categories[1];
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];

    targetCategoryOne.relationships.notes.ids.push(targetNote.id);
    targetCategoryTwo.relationships.recordings.ids.push(targetRecording.id);
    targetNote.relationships.category.id = targetCategoryOne.id;
    targetRecording.relationships.category.id = targetCategoryTwo.id;

    await db.categories.bulkPut([targetCategoryOne, targetCategoryTwo]);
    await db.recordings.put(targetRecording)
    await db.notes.put(targetNote);

    // Remove link
    const deleted = await CategoryController.deleteCategories([targetCategoryOne.id, targetCategoryTwo.id]);

    expect(deleted).toEqual(
        expect.objectContaining({
            updatedRecordings: expect.arrayContaining([
                expect.objectContaining({
                    id: targetRecording.id
                })
            ]),
            updatedNotes: expect.arrayContaining([
                expect.objectContaining({
                    id: targetNote.id
                })
            ])
        })
    );

    done();
});

test("it throws an error if any of the Categories do not exist", async done => {
    const seeded = await handler.seedTestDatabase();

    await expect(async () => {
        await CategoryController.deleteCategories([seeded.categories[0].id, "bad-id"]);
    }).rejects.toThrow("Category does not exist.");

    done();
});

test("it throws an error if any of the Categories link non-existent Media", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);
    newCategory.relationships.recordings.ids.push("bad-id");

    await db.categories.add(newCategory);

    await expect(async () => {
        await CategoryController.deleteCategories([seeded.categories[0].id, newCategory.id]);
    }).rejects.toThrow("Recording does not exist.");

    done();
});