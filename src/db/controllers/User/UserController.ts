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

export const selectUserData = (user: User): Promise<{
    recordings: Recording[],
    notes: Note[],
    categories: Category[]
}> => {
    return db.transaction('r', db.recordings, db.notes, db.categories, async () => ({
        recordings: await RecordingController.selectUserRecordings(user.id),
        notes: await NoteController.selectUserNotes(user.id),
        categories: await CategoryController.selectUserCategories(user.id)
    }));
}

// INSERT

export const insertUser = (name: string, greeting: string): Promise<User> => {
    return db.transaction('rw', db.users, async () => {
        const user = new User(name, greeting);

        await db.users.add(user);
        const fetched = await db.users.get(user.id);

        if (!fetched) throw new Error('Could not retrieve user.');

        return fetched;
    });
}

// UPDATE

// DELETE