import { db } from '../db';

import User from '../models/User';
import Recording from '../models/Recording';
import Note from '../models/Note';
import Category from '../models/Category';

const recordingTitles = [
    "User 1: Recording 1",
    "User 1: Recording 2",
    "User 1: Recording 3"
];

const noteTitles = [
    "User 1: Note 1",
    "User 1: Note 2",
    "User 1: Note 3"
];

const categoryTitles = [
    "User 1: Category 1",
    "User 1: Category 2",
    "User 1: Category 3"
];

export const seedTestDatabase = (): Promise<{
    user: User;
    recordings: Recording[];
    notes: Note[];
    categories: Category[];
}>  => {
    return db.transaction('rw', db.users, db.categories, db.notes, db.recordings, async () => {
        const user = new User("User 1", "");

        await db.users.add(user);

        const recordings = await Promise.all(recordingTitles.map(async title => {
            const recording = new Recording(user.id);
            recording.attributes.title = title;
            await db.recordings.add(recording);
            return recording;
        }));

        const notes = await Promise.all(noteTitles.map(async title => {
            const note = new Note(user.id);
            note.attributes.title = title;
            await db.notes.add(note);
            return note;
        }));

        const categories = await Promise.all(categoryTitles.map(async title => {
            const category = new Category(user.id);
            category.attributes.title = title;
            await db.categories.add(category);
            return category;
        }));

        return {
            user,
            recordings,
            notes,
            categories
        }
    })
}

export const clearTestDatabase = (): Promise<void> => {
    return db.transaction("rw", db.users, db.categories, db.notes, db.recordings, async () => {
        await db.users.clear();
        await db.recordings.clear();
        await db.notes.clear();
        await db.categories.clear();
    })
}