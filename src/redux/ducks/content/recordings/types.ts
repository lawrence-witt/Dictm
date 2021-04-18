import Recording from '../../../../db/models/Recording';

export const RECORDINGS_LOADED      = "dictm/media/recordings/RECORDINGS_LOADED";
export const RECORDING_CREATED      = "dictm/media/recordings/RECORDING_CREATED";
export const RECORDINGS_OVERWRITTEN = "dictm/media/recordings/RECORDINGS_OVERWRITTEN";
export const RECORDINGS_DELETED     = "dictm/media/recordings/RECORDINGS_DELETED";

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

export type RecordingsActionTypes =
|   RecordingsLoadedAction
|   RecordingCreatedAction
|   RecordingsOverwrittenAction
|   RecordingsDeletedAction;