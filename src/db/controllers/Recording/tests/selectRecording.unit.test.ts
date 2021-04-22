import { RecordingController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the correct Recording model", async done => {
    const seeded = await handler.seedTestDatabase();
    const target = seeded.recordings[0];

    const recording = await RecordingController.selectRecording(target.id);

    expect(recording).toBeDefined();
    expect(recording.attributes.title).toEqual(target.attributes.title);

    done();
});

test("it throws an error when the Recording does not exist", async done => {
    await expect(async () => {
        await RecordingController.selectRecording("bad-id");
    }).rejects.toThrow("Recording does not exist.");

    done();
});