// Object types 
interface KeyedAnyObject {
    [key: string]: any;
}

interface KeyedStringObject {
    [key: string]: string;
}

interface KeyedNumberObject {
    [key: string]: number;
}

interface KeyedBooleanObject {
    [key: string]: boolean;
}

// Web Audio Types
interface KeyedAnalyserNode extends AnalyserNode {
    [key: string] : any;
}

interface AnalyserOpts extends KeyedNumberObject {
    fftSize?: number;
    maxDecibels?: number;
    minDecibels?: number;
    smoothingTimeConstant?: number;
}

type AnalyserGets =
    | 'fftSize'
    | 'frequencyBinCount'
    | 'maxDecibels'
    | 'minDecibels'
    | 'smoothingTimeConstant'
    | 'floatFrequencyData'
    | 'byteFrequencyData'
    | 'floatTimeDomainData'
    | 'byteTimeDomainData'

// Parameter Types
interface ParamOptions {
    [key: string]: number | Blob | AnalyserOpts;
    file?: Blob;
    increment?: number;
    bitsPerSecond?: number;
    analyserOptions?: AnalyserOpts;
}



export {
    KeyedAnyObject,
    KeyedStringObject,
    KeyedNumberObject,
    KeyedBooleanObject,
    KeyedAnalyserNode,
    AnalyserOpts,
    AnalyserGets,
    ParamOptions
}