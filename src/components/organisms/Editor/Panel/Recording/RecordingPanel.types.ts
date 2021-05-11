import { CassetteProgressCallback } from 'cassette-js';

import { EditorContexts } from '../../../../../redux/ducks/editor';

export interface RecordingPanelButtonsProps {
    mode: "edit" | "play";
}

export interface RecordingPanelProps {
    mode: "edit" | "play";
    isSaveRequested: boolean;
    model: EditorContexts["recording"]["model"];
}

export interface TimerHandle {
    draw: CassetteProgressCallback;
}

export interface WaveHandle {
    init: (frequencies: number[][]) => void;
    buffer: CassetteProgressCallback;
    draw: CassetteProgressCallback;
    flush: () => void;
    frequencies: () => number[][];
}