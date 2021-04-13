import { nanoid } from 'nanoid';

import { CategoryModel } from './Category.types';

class Category implements CategoryModel {
    id: string;
    type = "category" as const;
    attributes: CategoryModel["attributes"];
    relationships: CategoryModel["relationships"];

    constructor(userId: string) {
        this.id = nanoid(10);
        this.attributes = {
            title: "",
            timestamps: {
                created: Date.now(),
                modified: Date.now()
            }
        };
        this.relationships = {
            user: { id: userId },
            recordings: { ids: [] },
            notes: { ids: [] }
        }
    }
}

export const categoryIndexes = [
    "id",
    "attributes.timestamps.created",
    "attributes.timestamps.modified",
    "relationships.user.id",
    "*relationships.recordings.ids",
    "*relationships.notes.ids"
].join(', ');

export default Category;