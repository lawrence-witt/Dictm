import { nanoid } from 'nanoid';

import { NoteModel } from './Note.types';

class Note implements NoteModel {
    id: string;
    type = "note" as const;
    attributes: NoteModel["attributes"];
    data: NoteModel["data"];
    relationships: NoteModel["relationships"];

    constructor(userId: string, categoryId?: string) {
        this.id = nanoid(10);
        this.attributes = {
            title: "",
            timestamps: {
                created: Date.now(),
                modified: Date.now()
            }
        };
        this.data = {
            content: "",
            charCount: 0,
            wordCount: 0
        };
        this.relationships = {
            user: { id: userId },
            category: { id: categoryId }
        }
    }
}

export const noteIndexes = [
    "id",
    "attributes.timestamps.created",
    "attributes.timestamps.modified",
    "relationships.user.id",
    "relationships.category.id"
].join(', ');

export default Note;