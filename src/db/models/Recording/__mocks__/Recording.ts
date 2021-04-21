/* 
*   Manually mock audio data so cassette-js worker code
*   is not invoked. Hopefully a temporary workaround.
*/

import { nanoid } from 'nanoid';

import { RecordingModel } from '../Recording.types';

class Recording implements RecordingModel {
    id: string;
    type = "recording" as const;
    attributes: RecordingModel["attributes"];
    data: RecordingModel["data"];
    relationships: RecordingModel["relationships"];

    constructor(userId: string) {
        this.id = nanoid(10);
        this.attributes = {
            title: "",
            timestamps: {
                created: Date.now(),
                modified: Date.now()
            }
        }
        this.data = {
            audio: {
                data: {
                    type: "wav",
                    bytes: new Uint8Array(0)
                },
                attributes: {
                    duration: 0,
                    sampleRate: 0,
                    timestamps: {
                        created: 0,
                        modified: 0
                    }
                },
                meta: {
                    version: 0
                }
            },
            frequencies: []
        }
        this.relationships = {
            user: { id: userId },
            category: { id: undefined }
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