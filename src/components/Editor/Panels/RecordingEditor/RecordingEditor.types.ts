import { CassetteProgressCallback } from 'cassette-js';

export interface RecordingBarButtonsProps {
    mode: 'edit' | 'play';
}

export interface RecordingEditorProps {
    mode: 'edit' | 'play';
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}