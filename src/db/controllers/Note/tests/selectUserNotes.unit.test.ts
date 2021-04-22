import { NoteController } from '..';
import * as handler from '../../../test/db-handler';

jest.mock("../../../models/Recording/Recording.ts");

afterEach(async () => {
    await handler.clearTestDatabase();
});

test("it returns every Note owned by a User in an array", async done => {
    const seeded = await handler.seedTestDatabase();

    const userNotes = await NoteController.selectUserNotes(seeded.user.id);

    expect(userNotes).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: seeded.notes[0].id
            }),
            expect.objectContaining({
                id: seeded.notes[1].id
            })
        ])
    );
    expect(userNotes).toHaveLength(2);

    done();
});

test("it throws an error when the User does not exist", async done => {
    await expect(async () => {
        await NoteController.selectUserNotes("bad-id");
    }).rejects.toThrow("User does not exist.");

    done();
});