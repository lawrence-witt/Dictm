import { CassetteProgressCallback } from 'cassette-js';

import { EditorContexts } from '../../../../../redux/ducks/editor';

export interface RecordingBarButtonsProps {
    mode: "edit" | "play";
}

export interface RecordingPanelProps {
    mode: "edit" | "play";
    model: EditorContexts["recording"]["data"]["editing"];
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}