import { StreamRecorderTrack } from 'cassette-js';

export interface RecordingIndex {
    id: string;
    attributes: {
        timestamps: {
            created: number;
            modified: number;
        }
    };
    relationships: {
        user: {
            id: string;
        };
        category: {
            id: string | undefined;
        };
    }
}

export interface RecordingModel extends RecordingIndex {
    type: "recording";
    attributes: RecordingIndex["attributes"] & {
        title: string;
    };
    data: {
        audio: StreamRecorderTrack<"wav">;
        frequencies: number[][];
    };
}