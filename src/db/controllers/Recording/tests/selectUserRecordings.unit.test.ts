import Recording from '../../../models/Recording';
import { RecordingController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns every Recording owned by a User in an array", async done => {
    const seeded = await handler.seedTestDatabase();

    const userRecordings = await RecordingController.selectUserRecordings(seeded.user.id);

    expect(userRecordings).toEqual(
        expect.arrayContaining([expect.any(Recording)])
    );
    expect(userRecordings).toHaveLength(2);

    done();
});

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await RecordingController.selectUserRecordings("bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
});