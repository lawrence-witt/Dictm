import { UserController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the correct User model", async done => {
    const seeded = await handler.seedTestDatabase();

    const user = await UserController.selectUser(seeded.user.id);

    expect(user).toEqual(
        expect.objectContaining({
            id: seeded.user.id
        })
    );

    done();
});

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await UserController.selectUser("bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
});