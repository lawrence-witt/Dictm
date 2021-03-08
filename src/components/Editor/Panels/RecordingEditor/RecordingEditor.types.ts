import { CassetteProgressCallback } from 'cassette-js';

export interface RecordingEditorProps {
    mode: 'edit' | 'play';
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}