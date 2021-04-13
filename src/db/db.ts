import Dexie from 'dexie';

import User, { UserIndex, userIndexes } from './models/User';
import Recording, { RecordingIndex, recordingIndexes } from './models/Recording';
import Note, { NoteIndex, noteIndexes } from './models/Note';
import Category, { CategoryIndex, categoryIndexes } from './models/Category';

class DictmDatabase extends Dexie {
    users: Dexie.Table<UserIndex, string>;
    recordings: Dexie.Table<RecordingIndex, string>;
    notes: Dexie.Table<NoteIndex, string>;
    categories: Dexie.Table<CategoryIndex, string>;

    constructor() {
        super("DictmDatabase");

        this.version(1).stores({
            users: userIndexes,
            recordings: recordingIndexes,
            notes: noteIndexes,
            categories: categoryIndexes
        });

        this.users = this.table("users");
        this.recordings = this.table("recordings");
        this.notes = this.table("notes");
        this.categories = this.table("categories");

        this.users.mapToClass(User);
        this.recordings.mapToClass(Recording);
        this.notes.mapToClass(Note);
        this.categories.mapToClass(Category);
    }
}

export const db = new DictmDatabase();