import { ProgressHandle } from '../RecordingPanel.types';

import {
    CassetteStatus,
    CassettePublicFlags,
    CassetteNodeMap
} from 'cassette-js';

// Component

export interface WaveFormProps {
    progressHandle: React.RefObject<ProgressHandle>;
    status: CassetteStatus;
    flags: CassettePublicFlags;
    handleStop: () => Promise<void>;
    handleScan: (type: 'to' | 'by', secs: number) => Promise<void>;
    handleTimeout: (type: 'set' | 'clear') => void;
    nodeMap: () => CassetteNodeMap;
}

// Class

export interface WaveFormOptions {
    textStyle: string;
    markStyle: string;
    waveStyle: string;
    font: string;
    offsetWidth: number;
    tapeHeight: number;
    waveHeight: number;
    markWidth: number;
    secondBuffer: number;
    secondWidth: number;
    secondMarkHeight: number;
    deciSecondMarkHeight: number;
}

export interface Buffer {
    secs: number;
    decis: number;
    buffer: number[];
}

export type BufferMap = Map<string, Buffer>;