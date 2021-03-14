import { CassetteProgressCallback } from 'cassette-js';

import { EditorContexts } from '../../../../../redux/ducks/editor';

export interface RecordingBarButtonsProps {
    attributes: EditorContexts["recording"]["attributes"];
}

export interface RecordingPanelProps {
    attributes: EditorContexts["recording"]["attributes"];
    model: EditorContexts["recording"]["data"]["edited"];
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}