import Dexie from 'dexie';

import { UserController } from '..';
import User from '../../../models/User';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it inserts a new User model into the database", async done => {
    const newUser = new User("Temp User", "");

    await UserController.insertUser(newUser);
    const retrieved = await UserController.selectUser(newUser.id);

    expect(retrieved).toBeInstanceOf(User);
    expect(newUser.id).toBe(retrieved.id);

    done();
});

test("it returns the inserted User model", async done => {
    const newUser = new User("Temp User", "");

    const inserted = await UserController.insertUser(newUser);

    expect(inserted).toBeInstanceOf(User);
    expect(newUser.id).toBe(inserted.id);

    done();
})

test("it throws an error if the User has an id already in the database", async done => {
    const seeded = await handler.seedTestDatabase();

    const newUser = new User("Temp User", "");
    newUser.id = seeded.user.id;

    await expect(async () => {
        await UserController.insertUser(newUser);
    }).rejects.toThrow(Dexie.ConstraintError);

    done();
});