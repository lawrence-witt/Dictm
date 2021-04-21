import { db } from '../db';

import User from '../models/User';
import Recording from '../models/Recording';
import Note from '../models/Note';
import Category from '../models/Category';

const recordings = [
    "User 1: Recording 1",
    "User 1: Recording 2"
];

const notes = [
    "User 1: Note 1",
    "User 1: Note 2"
];

const categories = [
    "User 1: Category 1",
    "User 2: Category 2"
];

export const seedTestDatabase = (): Promise<{
    userId: string;
    recordingIds: string[];
    noteIds: string[];
    categoryIds: string[];
}>  => {
    return db.transaction('rw', db.users, db.categories, db.notes, db.recordings, async () => {
        const user = new User("User 1", "");

        await db.users.add(user);

        const recordingIds = await Promise.all(recordings.map(async title => {
            const recording = new Recording(user.id);
            recording.attributes.title = title;
            await db.recordings.add(recording);
            return recording.id;
        }));

        const noteIds = await Promise.all(notes.map(async title => {
            const note = new Note(user.id);
            note.attributes.title = title;
            await db.notes.add(note);
            return note.id;
        }));

        const categoryIds = await Promise.all(categories.map(async title => {
            const category = new Category(user.id);
            category.attributes.title = title;
            await db.categories.add(category);
            return category.id;
        }));

        return {
            userId: user.id,
            recordingIds,
            noteIds,
            categoryIds
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