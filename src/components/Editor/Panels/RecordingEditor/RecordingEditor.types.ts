import { CassetteAnalysisCallback, CassetteProgressCallback } from 'cassette-js';

export interface RecordingBarButtonsProps {
    mode: 'edit' | 'play';
}

export interface RecordingEditorProps {
    mode: 'edit' | 'play';
}

export interface ProgressHandle {
    increment: CassetteProgressCallback;
}

export interface AnalysisHandle {
    output: CassetteAnalysisCallback;
}