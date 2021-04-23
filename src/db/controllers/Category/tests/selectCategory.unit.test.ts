import { CategoryController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the correct Category model", async done => {
    const seeded = await handler.seedTestDatabase();
    const targetCategory = seeded.categories[0];

    const retrieved = await CategoryController.selectCategory(targetCategory.id);

    expect(retrieved).toEqual(
        expect.objectContaining({
            id: targetCategory.id
        })
    );

    done();
});

test("it throws an error when the Category does not exist", async done => {
    await expect(async () => {
        await CategoryController.selectCategory("bad-id");
    }).rejects.toThrow("Category does not exist.");

    done();
});