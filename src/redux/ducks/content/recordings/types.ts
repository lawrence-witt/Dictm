import Recording from '../../../../db/models/Recording';

export const RECORDINGS_LOADED      = "dictm/content/recordings/RECORDINGS_LOADED";
export const RECORDING_CREATED      = "dictm/content/recordings/RECORDING_CREATED";
export const RECORDINGS_OVERWRITTEN = "dictm/content/recordings/RECORDINGS_OVERWRITTEN";
export const RECORDINGS_DELETED     = "dictm/content/recordings/RECORDINGS_DELETED";
export const RECORDINGS_CLEARED     = "dictm/content/recordings/RECORDINGS_CLEARED";

export interface RecordingsState {
    byId: Record<string, Recording>;
    allIds: string[];
}

export interface RecordingsLoadedAction {
    type: typeof RECORDINGS_LOADED;
    payload: {
        recordings: Recording[];
    }
}

export interface RecordingCreatedAction {
    type: typeof RECORDING_CREATED;
    payload: {
        recording: Recording;
    }
}

export interface RecordingsOverwrittenAction {
    type: typeof RECORDINGS_OVERWRITTEN;
    payload: {
        recordings: Recording[];
    }
}

export interface RecordingsDeletedAction {
    type: typeof RECORDINGS_DELETED;
    payload: {
        ids: string[];
    }
}

export interface RecordingsClearedAction {
    type: typeof RECORDINGS_CLEARED;
}

export type RecordingsActionTypes =
|   RecordingsLoadedAction
|   RecordingCreatedAction
|   RecordingsOverwrittenAction
|   RecordingsDeletedAction
|   RecordingsClearedAction;