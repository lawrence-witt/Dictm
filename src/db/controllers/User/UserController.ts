import { db } from '../../db';

import User from '../../models/User';

import Category from '../../models/Category';
import { CategoryController } from '../../controllers/Category';

import Note from '../../models/Note';
import { NoteController } from '../../controllers/Note';

import Recording from '../../models/Recording';
import { RecordingController } from '../../controllers/Recording';

// SELECT

export const selectLocalUsers = (): Promise<User[]> => {
    return db.users.toArray();
}

export const selectUser = async (id: string): Promise<User> => {
    const user = await db.users.get(id);
    if (!user) throw new Error('User could not be retrieved.');
    return user;
}

/* TODO: Validate (and correct) links between resources before returning them to user */
/* By catching them here, it should be possible to correct otherwise unrecoverable relationship errors by simply refreshing the page */

export const selectUserData = (id: string): Promise<{
    recordings: Recording[],
    notes: Note[],
    categories: Category[]
}> => {
    return db.transaction('r', db.users, db.recordings, db.notes, db.categories, async () => ({
        recordings: await RecordingController.selectUserRecordings(id),
        notes: await NoteController.selectUserNotes(id),
        categories: await CategoryController.selectUserCategories(id)
    }));
}

// INSERT

export const insertUser = (user: User): Promise<User> => {
    return db.transaction('rw', db.users, async () => {
        await db.users.add(user);
        const fetched = await db.users.get(user.id);

        if (!fetched) throw new Error('User could not be retrieved.');

        return fetched;
    });
}

// UPDATE

// DELETE