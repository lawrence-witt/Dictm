import { AnalyserGets, ParamOptions } from '../commonTypes';

// Params

type ErrorTypes = 'file' | 'connect' | 'record' | 'play' | 'encode';

interface CassetteParams {
    [key: string]: ((...args: unknown[]) => void) | ParamOptions;
    onError?: (type: ErrorTypes, err: Error) => void;
    onTapeProgress?: (progress: number, duration: number) => void;
    onEncodeProgress?: (percent: number) => void;
    options?: ParamOptions;
}

// Reducer

type StatusId = "waiting" | "recording" | "playing" | "paused";

interface State {
    id: StatusId;
    hasStream: boolean;
    hasData: boolean;
    isBuffering: boolean;
    tapeProgress: number;
    tapeDuration: number;
    encodePercent: number;
    encodedBlob: null | Blob;
}

type Actions = 
    | {type: "reset"}
    | {type: "fileSelected"}
    | {type: "fileBuffered", payload: number}
    | {type: "fileError"}
    | {type: "connected"}
    | {type: "disconnected"}
    | {type: "connectError"}
    | {type: "tapeProgress", payload: {progress: number; duration: number;};}
    | {type: "recStarted"}
    | {type: "recEnded"}
    | {type: "recBuffered"}
    | {type: "recError"}
    | {type: "encodeStarted"}
    | {type: "encodeProgress", payload: number}
    | {type: "encodeEnded", payload: Blob}
    | {type: "encodeError"}
    | {type: "playStarted"}
    | {type: "playEnded"}
    | {type: "playError"};


// Event Details

interface BaseDetail {
    stamp: number;
}

interface TapeProgressDetail extends BaseDetail {
    data: {progress: number; duration: number;};
}

interface NumberDetail extends BaseDetail {
    data: number;
}

interface BlobDetail extends BaseDetail {
    data: Blob;
}

interface ErrorDetail extends BaseDetail {
    data: Error;
}

type DetailUnion = 
    BaseDetail |
    TapeProgressDetail |
    NumberDetail |
    BlobDetail |
    ErrorDetail;

// Return

interface CassetteStatus {
    id: string;
    canConnect: boolean;
    canRecord: boolean;
    canPlay: boolean;
    canPause: boolean;
    canScan: boolean;
}

interface CassetteTape {
    progress: number;
    duration: number;
}

interface CassetteEncoded {
    percent: number;
    blob: Blob;
}

interface CassetteControls {
    connect: () => void;
    disconnect: () => void;
    record: () => void;
    play: () => void;
    pause: () => void;
    fastForward: (ms: number) => void;
    rewind: (ms: number) => void;
    getAnalyser: (prop: AnalyserGets, arg?: Float32Array | Uint8Array) => unknown;
}

interface CassetteReturn {
    status: CassetteStatus;
    tape: CassetteTape;
    encoded: CassetteEncoded;
    controls: CassetteControls;
}

export { 
    CassetteParams,
    State, 
    Actions, 
    BaseDetail, 
    TapeProgressDetail, 
    NumberDetail, 
    BlobDetail, 
    ErrorDetail, 
    DetailUnion,
    CassetteStatus,
    CassetteTape,
    CassetteEncoded,
    CassetteControls,
    CassetteReturn 
};