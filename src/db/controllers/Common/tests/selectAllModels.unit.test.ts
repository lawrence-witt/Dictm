import { CommonController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns all models of a particular type", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedUsers = [seeded.user];
    const expectedRecordings = seeded.recordings;
    const expectedNotes = seeded.notes;
    const expectedCategories = seeded.categories;

    const actualUsers = await CommonController.selectAllModels("users");
    const actualRecordings = await CommonController.selectAllModels("recordings");
    const actualNotes = await CommonController.selectAllModels("notes");
    const actualCategories = await CommonController.selectAllModels("categories");

    expect(actualUsers).toEqual(
        expect.arrayContaining(expectedUsers)
    );

    expect(actualRecordings).toEqual(
        expect.arrayContaining(expectedRecordings)
    );

    expect(actualNotes).toEqual(
        expect.arrayContaining(expectedNotes)
    );

    expect(actualCategories).toEqual(
        expect.arrayContaining(expectedCategories)
    );

    expect(actualUsers).toHaveLength(1);
    expect(actualRecordings).toHaveLength(3);
    expect(actualNotes).toHaveLength(3);
    expect(actualCategories).toHaveLength(3);

    done();
})