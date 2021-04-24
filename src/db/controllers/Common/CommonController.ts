import Dexie from 'dexie';

import { db, AllTables, ResourceTables, MediaTables } from '../../db';

const getSingluarFromPlural = (target: keyof AllTables, cap?: boolean) => {
    switch(target) {
        case "users" : return cap ? "User" as const : "user" as const;
        case "recordings" : return cap ? "Recording" as const : "recording" as const;
        case "notes" : return cap ? "Note" as const : "note" as const;
        case "categories" : return cap ? "Category" as const : "category" as const;
    }
}

const isResource = <T extends keyof AllTables>(
    model: AllTables[T]["returns"]
): model is ResourceTables[keyof ResourceTables]["returns"] => {
    return model.type !== "user";
}

const validateTableModel = <T extends keyof AllTables>(
    table: T, 
    model: AllTables[T]["returns"]
) => {
    if(getSingluarFromPlural(table) !== model.type) {
        throw new Error(`Table ${table} does not match model ${model.type}.`);
    }
}

const validiateUser = async (
    userId: string
) => {
    if (!(await db.users.get(userId))) throw new Error('User does not exist.');
}

// SELECT

export const selectAllModels = <T extends keyof AllTables>(
    table: T
): Promise<AllTables[T]["returns"][]> => {
    return db[table].toArray();
}

export const selectModelById = async <T extends keyof AllTables>(
    table: T,
    id: string
): Promise<AllTables[T]["returns"]> => {
    const model = await db[table].get(id);
    if (!model) throw new Error(`${getSingluarFromPlural(table, true)} does not exist.`);
    return model;
}

export const selectModelsById = <T extends keyof AllTables>(
    table: T,
    ids: string[]
): Promise<AllTables[T]["returns"][]> => {
    return db[table].where("id").anyOf(ids).toArray();
}

export const selectModelsByUserId = async <T extends keyof ResourceTables>(
    table: T,
    userId: string
): Promise<ResourceTables[T]["returns"][]> => {
    await validiateUser(userId);
    return db[table].where({"relationships.user.id": userId}).toArray();
}

// INSERT

export const insertModel = <T extends keyof AllTables>(
    table: T,
    model: AllTables[T]["returns"],
): Promise<AllTables[T]["returns"]> => {
    const includedTables = [db.users, db[table]];

    return db.transaction('rw', includedTables, async () => {
        validateTableModel(table, model);
        
        if (isResource(model)) await validiateUser(model.relationships.user.id);

        await db[table].add(model as any);

        return selectModelById(table, model.id);
    })
}

// UPDATE

export const updateModel = <T extends keyof AllTables>(
    table: T,
    model: AllTables[T]["returns"],
): Promise<{
    previous: AllTables[T]["returns"];
    current: AllTables[T]["returns"];
}> => {
    const includedTables = [db.users, db[table]];

    return db.transaction('rw', includedTables, async () => {
        validateTableModel(table, model);

        if (isResource(model)) await validiateUser(model.relationships.user.id);

        const previous = await selectModelById(table, model.id);
        await db[table].update(model.id, model);
        const current = await selectModelById(table, model.id);

        return { previous, current };
    })
}

export const updateMediaCategory = <T extends keyof MediaTables>(
    table: T,
    id: string,
    categoryId: string | undefined
): Promise<MediaTables[T]["returns"]> => {
    const includedTables = [db.categories, db[table]];

    return db.transaction('rw', includedTables, async () => {
        if (categoryId) await selectModelById("categories", categoryId);

        await db[table].where('id').equals(id).modify(media => {
            media.relationships.category.id = categoryId;
        });

        return selectModelById(table, id);
    });
}

export const updateCategoryMedia = (
    method: 'add' | 'remove',
    id: string,
    recordingIds: string[],
    noteIds: string[]
): Promise<ResourceTables["categories"]["returns"]> => {
    const includedTables: Dexie.Table[] = [db.categories];
    if (recordingIds.length > 0) includedTables.push(db.recordings);
    if (noteIds.length > 0) includedTables.push(db.notes);

    return db.transaction('rw', includedTables, async () => {
        const category = db.categories.where('id').equals(id);

        const modifier = {
            add: (target: {ids: string[]}, source: string[]) => {
                target.ids = [...target.ids, ...source];
            },
            remove: (target: {ids: string[]}, source: string[]) => {
                target.ids = target.ids.filter(id => !source.includes(id));
            }
        }[method];

        if (method === "add") {
            await Promise.all(recordingIds.map(id => selectModelById("recordings", id)));
            await Promise.all(noteIds.map(id => selectModelById("notes", id)));
        }

        if (recordingIds.length > 0) await category.modify(record => modifier(
            record.relationships.recordings,
            recordingIds
        ));

        if (noteIds.length > 0) await category.modify(record => modifier(
            record.relationships.notes,
            noteIds
        ));

        return selectModelById("categories", id);
    })
}

// DELETE

export const deleteModel = <T extends keyof AllTables>(
    table: T,
    id: string
): Promise<AllTables[T]["returns"]> => {
    return db.transaction('rw', db[table], async () => {
        const existing = await selectModelById(table, id);

        await db[table].delete(id);

        return existing;
    })
}