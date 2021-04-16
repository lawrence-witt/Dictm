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

export const overwriteRecording = (
    recording: Recording
): types.RecordingOverwrittenAction => ({
    type: types.RECORDING_OVERWRITTEN,
    payload: {
        recording
    }
});

export const updateRecordingCategory = (
    id: string,
    categoryId: string | undefined
): types.RecordingCategoryUpdatedAction => ({
    type: types.RECORDING_CATEGORY_UPDATED,
    payload: {
        id,
        categoryId
    }
});

export const deleteRecording = (
    id: string
): types.RecordingDeletedAction => ({
    type: types.RECORDING_DELETED,
    payload: {
        id
    }
});