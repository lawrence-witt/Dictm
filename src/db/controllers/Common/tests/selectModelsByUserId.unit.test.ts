import { CommonController } from '..';

import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the specified User's models of a particular type", async done => {
    const seeded = await handler.seedTestDatabase();

    const expectedRecordings = seeded.recordings;

    const actualRecordings = await CommonController.selectModelsByUserId("recordings", seeded.user.id);

    expect(actualRecordings).toEqual(
        expect.arrayContaining(expectedRecordings)
    );

    expect(actualRecordings).toHaveLength(3);

    done();
});

test("it throws an error if the User does not exist", async done => {
    await expect(async () => {
        await CommonController.selectModelsByUserId("recordings", "bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
});