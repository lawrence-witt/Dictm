import { NoteController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns the correct Note model", async done => {
    const seeded = await handler.seedTestDatabase();
    const target = seeded.notes[0];

    const note = await NoteController.selectNote(target.id);

    expect(note).toBeDefined();
    expect(note.attributes.title).toEqual(target.attributes.title);

    done();
});

test("it throws an error when the Note does not exist", async done => {
    await expect(async () => {
        await NoteController.selectNote("bad-id");
    }).rejects.toThrow("Note does not exist.");

    done();
});