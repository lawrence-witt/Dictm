import { CategoryController } from '..';
import { db } from '../../../db';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

test("it selects the correct Category resources", async done => {
    const seeded = await handler.seedTestDatabase();

    const targetCategoryOne = seeded.categories[0];
    const targetCategoryTwo = seeded.categories[1];
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];
    
    targetCategoryOne.relationships.recordings.ids.push(targetRecording.id);
    targetCategoryTwo.relationships.notes.ids.push(targetNote.id);

    await db.categories.bulkPut([targetCategoryOne, targetCategoryTwo]);
    const selected = await CategoryController.selectCategoriesByResourceIds(
        [targetRecording.id],
        [targetNote.id]
    );

    expect(selected).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: targetCategoryOne.id
            }),
            expect.objectContaining({
                id: targetCategoryTwo.id
            })
        ])
    );

    expect(selected).toHaveLength(2);

    done();
});

test("it excludes Categories from exclude array", async done => {
    const seeded = await handler.seedTestDatabase();
    
    const targetCategoryOne = seeded.categories[0];
    const targetCategoryTwo = seeded.categories[1];
    const targetRecording = seeded.recordings[0];
    const targetNote = seeded.notes[0];
    
    targetCategoryOne.relationships.recordings.ids.push(targetRecording.id);
    targetCategoryTwo.relationships.notes.ids.push(targetNote.id);

    await db.categories.bulkPut([targetCategoryOne, targetCategoryTwo]);
    const selected = await CategoryController.selectCategoriesByResourceIds(
        [targetRecording.id],
        [targetNote.id],
        [targetCategoryOne.id]
    );

    expect(selected).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: targetCategoryTwo.id
            })
        ])
    );

    expect(selected).toHaveLength(1);

    done();
})