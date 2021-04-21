import { UserController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

test("it retrieves the correct User model", async done => {
    const seeded = await handler.seedTestDatabase();

    const user = await UserController.selectUser(seeded.userId);

    expect(user).toBeDefined();
    expect(user.attributes.name).toEqual("User 1");

    await handler.clearTestDatabase();
    done();
});

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await UserController.selectUser("bad-id");
    }).rejects.toThrow("User could not be retrieved.");

    done();
});