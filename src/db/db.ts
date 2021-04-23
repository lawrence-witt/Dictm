import Dexie from 'dexie';

import User, { userIndexes } from './models/User';
import Recording, { recordingIndexes } from './models/Recording';
import Note, { noteIndexes } from './models/Note';
import Category, { categoryIndexes } from './models/Category';

class DictmDatabase extends Dexie {
    users: Dexie.Table<User, string>;
    recordings: Dexie.Table<Recording, string>;
    notes: Dexie.Table<Note, string>;
    categories: Dexie.Table<Category, string>;

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

export type AllTables = {
    users: {
        table: Dexie.Table<User, string>;
        returns: User;
    }
    recordings: {
        table: Dexie.Table<Recording, string>;
        returns: Recording;
    }
    notes: {
        table: Dexie.Table<Note, string>;
        returns: Note;
    }
    categories: {
        table: Dexie.Table<Category, string>;
        returns: Category;
    }
}

export type ResourceTables = Omit<AllTables, "users">;
export type MediaTables = Omit<ResourceTables, "categories">;

export const db = new DictmDatabase();