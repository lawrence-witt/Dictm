import { CommonController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the specified models of a particular type", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecordings = [seeded.recordings[0], seeded.recordings[2]];
    const expectedNotes = [seeded.notes[0], seeded.notes[2]];
    const expectedCategories = [seeded.categories[0], seeded.categories[2]];

    const actualRecordings = await CommonController.selectModelsById("recordings", expectedRecordings.map(r => r.id));
    const actualNotes = await CommonController.selectModelsById("notes", expectedNotes.map(n => n.id));
    const actualCategories = await CommonController.selectModelsById("categories", expectedCategories.map(c => c.id));

    expect(actualRecordings).toEqual(
        expect.arrayContaining(expectedRecordings)
    );

    expect(actualNotes).toEqual(
        expect.arrayContaining(expectedNotes)
    );

    expect(actualCategories).toEqual(
        expect.arrayContaining(expectedCategories)
    );

    expect(actualRecordings).toHaveLength(2);
    expect(actualNotes).toHaveLength(2);
    expect(actualCategories).toHaveLength(2);

    done();
})

test("it ignores any ids which do not reference a model", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecordings = [seeded.recordings[0]];

    const actualRecordings = await CommonController.selectModelsById("recordings", ["bad-id", expectedRecordings[0].id]);

    expect(actualRecordings).toEqual(
        expect.arrayContaining(expectedRecordings)
    );

    expect(actualRecordings).toHaveLength(1);

    done();
});