import { db } from '../../db';

import User from '../../models/User';
import Category from '../../models/Category';
import Note from '../../models/Note';
import Recording from '../../models/Recording';

// SELECT

export const getLocalUsers = (): Promise<User[]> => {
    return db.users.toArray();
}

export const getUserData = (user: User): Promise<{
    recordings: Recording[],
    notes: Note[],
    categories: Category[]
}> => {
    return db.transaction('r', db.recordings, db.notes, db.categories, async () => {
        const recordings = await db.recordings.where({"relationships.user.id": user.id}).toArray();
        const notes = await db.notes.where({"relationships.user.id": user.id}).toArray();
        const categories = await db.categories.where({"relationships.user.id": user.id}).toArray();

        return {
            recordings,
            notes,
            categories
        }
    });
}

// INSERT

export const createNewUser = (name: string, greeting: string): Promise<User> => {
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