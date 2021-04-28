import { db } from '../../db';

import User from '../../models/User';

import { CommonController } from '../Common';

import Category from '../../models/Category';
import Note from '../../models/Note';
import Recording from '../../models/Recording';

// SELECT

export const selectUser = async (id: string): Promise<User> => {
    return CommonController.selectModelById("users", id);
}

export const selectUsers = (): Promise<User[]> => {
    return CommonController.selectAllModels("users");
}

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

/* 
*   Summary:
*   Repairs broken links between a User's resources.
*
*   Description:
*   This method is a last resort fallback, to prevent user data becoming
*   unrecoverable in the event that links are invalidated by browser
*   resources being deleted outside the scope of the application.
*/

export const repairUserData = (id: string): Promise<void> => {
    return db.transaction('rw', db.users, db.recordings, db.notes, db.categories, async () => {
        await selectUser(id);

        const data = {
            recordings: await CommonController.selectModelsByUserId("recordings", id),
            notes: await CommonController.selectModelsByUserId("notes", id),
            categories: await CommonController.selectModelsByUserId("categories", id)
        }

        const proveMedia = async (model: Recording | Note) => {
            const table = `${model.type}s` as const;
            const categoryId = model.relationships.category.id;

            if (!categoryId) return;

            const existingCategory = data.categories.find(category => category.id === categoryId);

            if (!existingCategory || !existingCategory.relationships[table].ids.includes(model.id)) {
                await CommonController.updateMediaCategory(table, model.id, undefined);
            }
        }

        const proveCategory = async (model: Category) => {
            const recordingIds = model.relationships.recordings.ids;
            const noteIds = model.relationships.notes.ids;

            const proveMediaId = (table: "recordings" | "notes", mediaId: string) => {
                // Typescript struggles with union of array types, as opposed to array of union type
                // https://github.com/microsoft/TypeScript/issues/33591
                const collection = data[table] as Array<Recording | Note>;
                const existingModel = collection.find(media => media.id === mediaId);

                if (!existingModel || existingModel.relationships.category.id !== model.id) {
                    return table === "recordings" ?
                        CommonController.updateCategoryMedia("remove", model.id, [mediaId], []) :
                        CommonController.updateCategoryMedia("remove", model.id, [], [mediaId])
                }
            }

            await Promise.all(recordingIds.map(id => proveMediaId("recordings", id)));
            await Promise.all(noteIds.map(id => proveMediaId("notes", id)));
        }

        await Promise.all([...data.recordings, ...data.notes].map(model => proveMedia(model)));
        await Promise.all(data.categories.map(category => proveCategory(category)));
    })
}

// DELETE