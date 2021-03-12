import { RecordingModel } from '../../../_data/recordingsData';

export const RECORDING_ADDED = "dictm/media/recordings/RECORDING_ADDED";

export interface RecordingsState {
    byId: Record<string, RecordingModel>;
    allIds: string[];
}

interface RecordingAddedAction {
    type: typeof RECORDING_ADDED;
    payload: {
        recording: RecordingModel;
    }
}

export type RecordingsActionTypes = RecordingAddedAction;