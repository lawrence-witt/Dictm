import Dexie from 'dexie';

import { db } from '../../../db';

import Category from '../../../models/Category';
import { CategoryController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it inserts a new Category model into the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);

    await CategoryController.insertCategory(newCategory);
    const retrieved = await db.categories.get(newCategory.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            id: newCategory.id
        })
    );

    done();
});

test("it updates any Recordings affected by the insertion", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);
    const targetRecording = seeded.recordings[0];
    newCategory.relationships.recordings.ids.push(targetRecording.id);

    await CategoryController.insertCategory(newCategory);
    const updatedRecording = await db.recordings.get(targetRecording.id);

    expect(updatedRecording).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: newCategory.id
                })
            })
        })
    );

    done();
});

test("it updates any Notes affected by the insertion", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);
    const targetNote = seeded.notes[0];
    newCategory.relationships.notes.ids.push(targetNote.id);

    await CategoryController.insertCategory(newCategory);
    const updatedNote = await db.notes.get(targetNote.id);

    expect(updatedNote).toEqual(
        expect.objectContaining({
            relationships: expect.objectContaining({
                category: expect.objectContaining({
                    id: newCategory.id
                })
            })
        })
    );

    done();
});

test("it updates any Categories affected by the insertion", async done => {
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
    const newCategory = new Category(seeded.user.id);
    newCategory.relationships.recordings.ids.push(targetRecording.id);

    await CategoryController.insertCategory(newCategory);
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

test("it returns the inserted Category and an object containing updated Resources", async done => {
    const seeded = await handler.seedTestDatabase();

    const newCategory = new Category(seeded.user.id);
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];
    newCategory.relationships.recordings.ids.push(targetRecording.id);
    newCategory.relationships.notes.ids.push(targetNote.id);

    const updated = await CategoryController.insertCategory(newCategory);

    expect(updated).toEqual(
        expect.objectContaining({
            category: expect.objectContaining({id: newCategory.id}),
            updatedRecordings: expect.arrayContaining([
                expect.objectContaining({id: targetRecording.id})
            ]),
            updatedNotes: expect.arrayContaining([
                expect.objectContaining({id: targetNote.id})
            ]),
            updatedCategories: expect.arrayContaining([])
        })
    );

    done();
});

test("it throws an error if the new Category's id is already in the database", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);
    newCategory.id = seeded.categories[0].id;

    await expect(async () => {
        await CategoryController.insertCategory(newCategory);
    }).rejects.toThrow(Dexie.ConstraintError);

    done();
});

test("it throws an error if the Category links a non-existent User id", async done => {
    const newCategory = new Category("bad-id");

    await expect(async () => {
        await CategoryController.insertCategory(newCategory);
    }).rejects.toThrow("User does not exist.");

    done();
});

test("it throws an error if the Category links a non-existent Media id", async done => {
    const seeded = await handler.seedTestDatabase();
    const newCategory = new Category(seeded.user.id);
    newCategory.relationships.recordings.ids.push("bad-id");

    await expect(async () => {
        await CategoryController.insertCategory(newCategory);
    }).rejects.toThrow("Recording does not exist.");

    done();
})