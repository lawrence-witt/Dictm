import { db } from '../../db';

import User from '../../models/User';

import { CommonController } from '../Common';

import Category from '../../models/Category';
import Note from '../../models/Note';
import Recording from '../../models/Recording';

// SELECT

export const selectLocalUsers = (): Promise<User[]> => {
    return CommonController.selectAllModels("users");
}

export const selectUser = async (id: string): Promise<User> => {
    return CommonController.selectModelById("users", id);
}

/* TODO: Validate (and correct) links between resources before returning them to user */
/* By catching them here, it should be possible to correct otherwise unrecoverable relationship errors by simply reloading the app */

export const selectUserData = (id: string): Promise<{
    recordings: Recording[],
    notes: Note[],
    categories: Category[]
}> => {
    return db.transaction('r', db.users, db.recordings, db.notes, db.categories, async () => ({
        recordings: await CommonController.selectModelsByUserId("recordings", id),
        notes: await CommonController.selectModelsByUserId("notes", id),
        categories: await CommonController.selectModelsByUserId("categories", id)
    }));
}

// INSERT

export const insertUser = (user: User): Promise<User> => {
    return CommonController.insertModel("users", user);
}

// UPDATE

// DELETE