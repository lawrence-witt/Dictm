import { UserController } from '..';
import Recording from '../../../models/Recording';
import Note from '../../../models/Note';
import Category from '../../../models/Category';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns every content model owned by a User in an object", async done => {
    const seeded = await handler.seedTestDatabase();

    const userData = await UserController.selectUserData(seeded.user.id);

    expect(userData).toEqual(
        expect.objectContaining({
            recordings: expect.arrayContaining([expect.any(Recording)]),
            notes: expect.arrayContaining([expect.any(Note)]),
            categories: expect.arrayContaining([expect.any(Category)])
        })
    );

    expect(userData.recordings).toHaveLength(2);
    expect(userData.notes).toHaveLength(2);
    expect(userData.categories).toHaveLength(2);

    done();
});

// TODO: add tests for relationship validatation/correction

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await UserController.selectUserData("bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
})