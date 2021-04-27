import { CassetteProgressCallback } from 'cassette-js';

import { EditorContexts } from '../../../../../redux/ducks/editor';

export interface RecordingPanelButtonsProps {
    mode: "edit" | "play";
}

export interface RecordingPanelProps {
    mode: "edit" | "play";
    model: EditorContexts["recording"]["data"]["editing"];
}

export interface TimerHandle {
    increment: CassetteProgressCallback;
}

export interface WaveHandle {
    init: (frequencies: number[][]) => void;
    increment: CassetteProgressCallback;
    flush: () => void;
    frequencies: () => number[][];
}