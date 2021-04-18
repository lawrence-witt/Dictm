import * as types from './types';

import Recording from '../../../../db/models/Recording';

export const loadRecordings = (
    recordings: Recording[]
): types.RecordingsLoadedAction => ({
    type: types.RECORDINGS_LOADED,
    payload: {
        recordings
    }
})

export const createRecording = (
    recording: Recording
): types.RecordingCreatedAction => ({
    type: types.RECORDING_CREATED,
    payload: {
        recording
    }
});

export const overwriteRecordings = (
    recordings: Recording[]
): types.RecordingsOverwrittenAction => ({
    type: types.RECORDINGS_OVERWRITTEN,
    payload: {
        recordings
    }
});

export const deleteRecordings = (
    ids: string[]
): types.RecordingsDeletedAction => ({
    type: types.RECORDINGS_DELETED,
    payload: {
        ids
    }
});

export const clearRecordings = (): types.RecordingsClearedAction => ({
    type: types.RECORDINGS_CLEARED
});