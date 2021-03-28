import * as types from './types';

import { RecordingModel } from '../../../_data/recordingsData';

export const updateRecordingEditorMode = (
    mode: "edit" | "play"
): types.RecordingEditorModeUpdatedAction => ({
    type: types.RECORDING_EDITOR_MODE_UPDATED,
    payload: {
        mode
    }
});

export const updateRecordingEditorTitle = (
    title: string
): types.RecordingEditorTitleUpdatedAction => ({
    type: types.RECORDING_EDITOR_TITLE_UPDATED,
    payload: {
        title
    }
});

export const updateRecordingEditorCategory = (
    id?: string
): types.RecordingEditorCategoryUpdatedAction => ({
    type: types.RECORDING_EDITOR_CATEGORY_UPDATED,
    payload: {
        id
    }
});

export const updateRecordingEditorData = (
    data: RecordingModel["data"]
): types.RecordingEditorDataUpdatedAction => ({
    type: types.RECORDING_EDITOR_DATA_UPDATED,
    payload: {
        data
    }
});