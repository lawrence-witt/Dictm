import { CategoryController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns every Category owned by a User in an array", async done => {
    const seeded = await handler.seedTestDatabase();

    const userCategories = await CategoryController.selectUserCategories(seeded.user.id);

    expect(userCategories).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: seeded.categories[0].id
            }),
            expect.objectContaining({
                id: seeded.categories[1].id
            })
        ])
    );
    expect(userCategories).toHaveLength(2);

    done();
});

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await CategoryController.selectUserCategories("bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
});