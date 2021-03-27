import { RecordingModel } from '../../../_data/recordingsData';

export const RECORDING_CREATED              = "dictm/media/recordings/RECORDING_CREATED";
export const RECORDING_OVERWRITTEN          = "dictm/media/recordings/RECORDING_OVERWRITTEN";
export const RECORDING_CATEGORY_UPDATED     = "dictm/media/recordings/RECORDING_CATEGORY_UPDATED";
export const RECORDING_DELETED              = "dictm/media/recordings/RECORDING_DELETED";

export interface RecordingsState {
    byId: Record<string, RecordingModel>;
    allIds: string[];
}

export interface RecordingCreatedAction {
    type: typeof RECORDING_CREATED;
    payload: {
        recording: RecordingModel;
    }
}

export interface RecordingOverwrittenAction {
    type: typeof RECORDING_OVERWRITTEN;
    payload: {
        recording: RecordingModel;
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
    RecordingCreatedAction |
    RecordingOverwrittenAction |
    RecordingCategoryUpdatedAction |
    RecordingDeletedAction;