import { UserController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns an array of all User models", async done => {
    const seeded = await handler.seedTestDatabase();

    const users = await UserController.selectLocalUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty('id', seeded.user.id);

    done();
});

test("it returns an empty array when no User models exist", async done => {
    const users = await UserController.selectLocalUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(0);

    done();
});