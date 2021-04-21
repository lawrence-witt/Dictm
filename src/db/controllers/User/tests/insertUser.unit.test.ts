import Dexie from 'dexie';

import { UserController } from '..';
import User from '../../../models/User';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

test("it inserts a new User model into the database", async done => {
    const tmpUser = new User("Temp User", "");

    const inserted = await UserController.insertUser(tmpUser);
    const retrieved = await UserController.selectUser(inserted.id);

    expect(inserted).toBeDefined();
    expect(retrieved).toBeDefined();
    expect(tmpUser.id).toBe(retrieved.id);

    await handler.clearTestDatabase();
    done();
});

test("it throws an error when the new User's id already exists in the database", async done => {
    const seeded = await handler.seedTestDatabase();

    const tmpUser = new User("Temp User", "");
    tmpUser.id = seeded.userId;

    await expect(async () => {
        await UserController.insertUser(tmpUser);
    }).rejects.toThrow(Dexie.ConstraintError);

    done();
});