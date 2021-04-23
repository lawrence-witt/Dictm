import { db, AllTables, ResourceTables, MediaTables } from '../../db';

const getSingluarFromPlural = (target: keyof AllTables, cap?: boolean) => {
    switch(target) {
        case "users" : return cap ? "User" as const : "user" as const;
        case "recordings" : return cap ? "Recording" as const : "recording" as const;
        case "notes" : return cap ? "Note" as const : "note" as const;
        case "categories" : return cap ? "Category" as const : "category" as const;
    }
}

const tableMatchesModel = <T extends keyof AllTables>(
    table: T, 
    model: AllTables[T]["returns"]
) => {
    return getSingluarFromPlural(table) === model.type;
}

// SELECT

export const selectTable = <T extends keyof AllTables>(
    table: T
): Promise<AllTables[T]["returns"][]> => {
    return db[table].toArray();
}

export const selectModelById = async <T extends keyof AllTables>(
    table: T,
    id: string
): Promise<AllTables[T]["returns"]> => {
    const content = await db[table].get(id);
    if (!content) throw new Error(`${getSingluarFromPlural(table, true)} does not exist.`);
    return content;
}

export const selectModelsByUserId = <T extends keyof ResourceTables>(
    table: T,
    userId: string
): Promise<ResourceTables[T]["returns"][]> => {
    return db.transaction('r', db.users, db[table], async () => {
        if (!(await db.users.get(userId))) throw new Error('User does not exist.');
        return db[table].where({"relationships.user.id": userId}).toArray();
    });
}

// INSERT

export const insertModel = <T extends keyof AllTables>(
    table: T,
    model: AllTables[T]["returns"],
): Promise<AllTables[T]["returns"]> => {
    return db.transaction('rw', db[table], async () => {
        if (!tableMatchesModel(table, model)) {
            throw new Error(`Table ${table} does not match model ${model.type}.`);
        }

        await db[table].add(model as any);
        const added = await db[table].get(model.id);

        if (!added) {
            throw new Error(`${getSingluarFromPlural(table, true)} could not be added.`);
        }

        return added;
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
    return db.transaction('rw', db[table], async () => {
        if (!tableMatchesModel(table, model)) {
            throw new Error(`Table ${table} does not match model ${model.type}.`);
        }

        const previous = await db[table].get(model.id);
        await db[table].update(model.id, model);
        const current = await db[table].get(model.id);

        if (!previous || !current) {
            throw new Error(`${getSingluarFromPlural(table, true)} does not exist.`)
        }

        return {
            previous,
            current
        };
    })
}

export const updateMediaCategory = <T extends keyof MediaTables>(
    table: T,
    id: string,
    categoryId: string | undefined
): Promise<MediaTables[T]["returns"]> => {
    return db.transaction('rw', db.categories, db[table], async () => {
        if (categoryId && !(await db.categories.get(categoryId))) {
            throw new Error('Category does not exist.');
        }

        await db[table].where('id').equals(id).modify(media => {
            media.relationships.category.id = categoryId;
        });

        const updated = await db[table].get(id);
        if (!updated) throw new Error(`${getSingluarFromPlural(table, true)} does not exist.`);
        
        return updated;
    });
}

export const updateCategoryMedia = (
    method: 'add' | 'remove',
    id: string,
    recordingIds: string[],
    noteIds: string[]
): Promise<ResourceTables["categories"]["returns"]> => {
    return db.transaction('rw', db.categories, async () => {
        const category = db.categories.where('id').equals(id);

        const modifier = {
            add: (target: {ids: string[]}, source: string[]) => {
                target.ids = [...target.ids, ...source];
            },
            remove: (target: {ids: string[]}, source: string[]) => {
                target.ids = target.ids.filter(id => !source.includes(id));
            }
        }[method];

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
        const existing = await db[table].get(id);
        if (!existing) throw new Error(`${getSingluarFromPlural(table, true)} does not exist.`);

        await db[table].delete(id);

        return existing;
    })
}