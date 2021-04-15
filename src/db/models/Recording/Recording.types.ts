import { StreamRecorderTrack } from 'cassette-js';

export interface RecordingModel {
    id: string;
    type: "recording";
    attributes: {
        title: string;
        timestamps: {
            created: number;
            modified: number;
        }
    };
    data: {
        audio: StreamRecorderTrack<"wav">;
        frequencies: number[][];
    };
    relationships: {
        user: {
            id: string;
        };
        category: {
            id: string | undefined;
        };
    };
}