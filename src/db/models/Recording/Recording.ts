import { nanoid } from 'nanoid';

import { RecordingModel } from './Recording.types';

import { generateBlankTrack } from 'cassette-js';

class Recording implements RecordingModel {
    id: string;
    type = "recording" as const;
    attributes: RecordingModel["attributes"];
    data: RecordingModel["data"];
    relationships: RecordingModel["relationships"];

    constructor(userId: string, categoryId?: string) {
        this.id = nanoid(10);
        this.attributes = {
            title: "",
            timestamps: {
                created: Date.now(),
                modified: Date.now()
            }
        }
        this.data = {
            audio: generateBlankTrack("wav"),
            frequencies: []
        }
        this.relationships = {
            user: { id: userId },
            category: { id: categoryId }
        }
    }
}

export const recordingIndexes = [
    "id",
    "attributes.timestamps.created",
    "attributes.timestamps.modified",
    "relationships.user.id",
    "relationships.category.id"
].join(', ');

export default Recording;