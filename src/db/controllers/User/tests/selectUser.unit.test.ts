import { UserController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the correct User model", async done => {
    const seeded = await handler.seedTestDatabase();

    const user = await UserController.selectUser(seeded.user.id);

    expect(user).toBeDefined();
    expect(user.attributes.name).toEqual(seeded.user.attributes.name);

    done();
});

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await UserController.selectUser("bad-id");
    }).rejects.toThrow("User could not be retrieved.");

    done();
});