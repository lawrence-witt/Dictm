import Recording from '../../../../db/models/Recording';

import { EditorContext, EditorOpenedAction } from '../types';

export const RECORDING_EDITOR_MODE_UPDATED          = "dictm/editor/recording/RECORDING_MODE_UPDATED";
export const RECORDING_EDITOR_TITLE_UPDATED         = "dictm/editor/recording/RECORDING_TITLE_UPDATED";
export const RECORDING_EDITOR_CATEGORY_UPDATED      = "dictm/editor/recording/RECORDING_CATEGORY_UPDATED";
export const RECORDING_EDITOR_ATTRIBUTES_UPDATED    = "dictm/editor/recording/RECORDING_ATTRIBUTES_UPDATED";
export const RECORDING_EDITOR_DATA_UPDATED          = "dictm/editor/recording/RECORDING_DATA_UPDATED";

export interface RecordingEditorContext extends EditorContext<Recording> {
    mode: "edit" | "play";
}

export interface RecordingEditorModeUpdatedAction {
    type: typeof RECORDING_EDITOR_MODE_UPDATED;
    payload: {
        mode: "edit" | "play";
    }
}

export interface RecordingEditorTitleUpdatedAction {
    type: typeof RECORDING_EDITOR_TITLE_UPDATED;
    payload: {
        title: string;
    }
}

export interface RecordingEditorCategoryUpdatedAction {
    type: typeof RECORDING_EDITOR_CATEGORY_UPDATED;
    payload: {
        id?: string;
    }
}

export interface RecordingEditorAttributesUpdatedAction {
    type: typeof RECORDING_EDITOR_ATTRIBUTES_UPDATED;
    payload: {
        attributes: Recording["data"]["audio"]["attributes"];
    }
}

export interface RecordingEditorDataUpdatedAction {
    type: typeof RECORDING_EDITOR_DATA_UPDATED;
    payload: {
        data: Recording["data"];
    }
}

export type RecordingEditorActionTypes =
    EditorOpenedAction |
    RecordingEditorModeUpdatedAction |
    RecordingEditorTitleUpdatedAction |
    RecordingEditorCategoryUpdatedAction |
    RecordingEditorAttributesUpdatedAction |
    RecordingEditorDataUpdatedAction;