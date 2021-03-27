import * as types from './types';

import { RecordingModel } from '../../../_data/recordingsData';

export const createRecording = (
    recording: RecordingModel
): types.RecordingCreatedAction => ({
    type: types.RECORDING_CREATED,
    payload: {
        recording
    }
});

export const overwriteRecording = (
    recording: RecordingModel
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