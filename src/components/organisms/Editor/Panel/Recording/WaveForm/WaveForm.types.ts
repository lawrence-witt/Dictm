import { WaveHandle } from '../RecordingPanel.types';

import {
    CassetteStatus,
    CassettePublicFlags
} from 'cassette-js';

// Component

export interface WaveFormProps {
    waveHandle: React.RefObject<WaveHandle>;
    status: CassetteStatus;
    flags: CassettePublicFlags;
    analyser: AnalyserNode | null;
    handleStop: () => Promise<void>;
    handleScan: (type: 'to' | 'by', secs: number) => Promise<void>;
    handleTimeout: (type: 'set' | 'clear') => void;
}

// Class

export type WaveFormOptions = {
    textStyle: string;
    markStyle: string;
    waveStyle: string;
    font: string;
    offsetWidth: number;
    tapeHeight: number;
    waveHeight: number;
    nullHeight: number;
    secondBuffer: number;
    secondWidth: number;
    secondMarkHeight: number;
    deciSecondMarkHeight: number;
    markWidth: number;
}

export interface Buffer {
    secs: number;
    decis: number;
    buffer: number[];
}

export type DrawBuffer = Map<string, {
    secs: number;
    decis: number;
    buffer: number[];
}>

export interface DrawFrame {
    rescale: boolean;
    clear: {
        deciseconds: { secs: number, decis: number }[];
    };
    add: {
        seconds: number[];
        deciseconds: { secs: number; decis: number; freq: number }[]
    }
}

export type BufferMap = Map<string, Buffer>;