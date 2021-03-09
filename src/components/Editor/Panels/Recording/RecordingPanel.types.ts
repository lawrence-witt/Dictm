import { CassetteProgressCallback } from 'cassette-js';

export interface RecordingPanelProps {
    mode: 'edit' | 'play';
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}