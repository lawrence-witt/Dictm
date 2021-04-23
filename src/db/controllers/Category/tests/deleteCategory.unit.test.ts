import { db } from '../../../db';

import { CategoryController } from '..';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it deletes the Category from the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];

    const original = await db.categories.get(targetCategory.id);
    await CategoryController.deleteCategory(targetCategory.id);
    const retrieved = await db.categories.get(targetCategory.id);

    expect(original).toBeInstanceOf(Category);
    expect(retrieved).toBeUndefined();

    done();
});

test("it updates any Media affected by the Category deletion", async done => {
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
    await CategoryController.deleteCategory(targetCategory.id);
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

test("returns an object containing all the updated Media models", async done => {
    const seeded = await handler.seedTestDatabase();

    const targetCategory = seeded.categories[0];
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];
    targetCategory.relationships.notes.ids.push(targetNote.id);
    targetCategory.relationships.recordings.ids.push(targetRecording.id);
    targetRecording.relationships.category.id = targetCategory.id;
    targetNote.relationships.category.id = targetCategory.id;

    await db.categories.update(targetCategory.id, targetCategory);
    await db.recordings.update(targetRecording.id, targetRecording);
    await db.notes.update(targetNote.id, targetNote);

    const deleted = await CategoryController.deleteCategory(targetCategory.id);

    expect(deleted).toEqual(
        expect.objectContaining({
            updatedRecordings: expect.arrayContaining([
                expect.objectContaining({id: targetRecording.id})
            ]),
            updatedNotes: expect.arrayContaining([
                expect.objectContaining({id: targetNote.id})
            ])
        })
    );

    done();
});

test("it throws an error if the Category does not exist", async done => {
    await expect(async () => {
        await CategoryController.deleteCategory("bad-id");
    }).rejects.toThrow("Category does not exist.");

    done();
});

test("it throws an error if the Category links a non-existent Media id", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);
    newCategory.relationships.recordings.ids.push("bad-id");

    await db.categories.add(newCategory);

    await expect(async () => {
        await CategoryController.deleteCategory(newCategory.id);
    }).rejects.toThrow("Recording does not exist.");

    done();
});