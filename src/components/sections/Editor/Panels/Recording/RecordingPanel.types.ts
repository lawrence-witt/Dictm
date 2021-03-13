import { CassetteProgressCallback } from 'cassette-js';

import { RecordingModel } from '../../../../../redux/_data/recordingsData';

export interface RecordingBarButtonsProps {
    model: RecordingModel;
}

export interface RecordingPanelProps {
    model: RecordingModel
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}