import Recording from '../../../../db/models/Recording';

export const RECORDINGS_LOADED              = "dictm/media/recordings/RECORDINGS_LOADED";
export const RECORDING_CREATED              = "dictm/media/recordings/RECORDING_CREATED";
export const RECORDING_OVERWRITTEN          = "dictm/media/recordings/RECORDING_OVERWRITTEN";
export const RECORDING_CATEGORY_UPDATED     = "dictm/media/recordings/RECORDING_CATEGORY_UPDATED";
export const RECORDING_DELETED              = "dictm/media/recordings/RECORDING_DELETED";

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

export interface RecordingOverwrittenAction {
    type: typeof RECORDING_OVERWRITTEN;
    payload: {
        recording: Recording;
    }
}

export interface RecordingCategoryUpdatedAction {
    type: typeof RECORDING_CATEGORY_UPDATED;
    payload: {
        id: string;
        categoryId: string | undefined;
    }
}

export interface RecordingDeletedAction {
    type: typeof RECORDING_DELETED;
    payload: {
        id: string;
    }
}

export type RecordingsActionTypes =
|   RecordingsLoadedAction
|   RecordingCreatedAction
|   RecordingOverwrittenAction
|   RecordingCategoryUpdatedAction
|   RecordingDeletedAction;