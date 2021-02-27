import React from 'react';
import isEqual from 'react-fast-compare';
import Cassette, { 
    CassetteUserParams, 
    CassetteStatus, 
    CassetteAnalyserEmissions,
    CassetteErrorCallback,
    WavObject
} from 'cassette-js';

/*  
*   REMEMBER TO UNLINK CASSETTE-JS **HERE FIRST** 
*   BEFORE MAKING DEP/PATH CHANGES TO EITHER 
*/

const useCassette = (
    clockOptions?: CassetteUserParams["clockOptions"],
    analyserOptions?: CassetteUserParams["analyserOptions"],
    onProgress?: CassetteUserParams["onProgress"],
    onStatus?: CassetteUserParams["onStatus"],
    onAnalysis?: CassetteUserParams["onAnalysis"],
    onError?: CassetteUserParams["onError"]
) => {
    // Base Class

    const cassette = React.useRef<Cassette>(null);

    // Utility Callbacks

    const getFlags = React.useCallback(() => ({
        hasData: Boolean(cassette.current.wavData),
        canConnect: cassette.current.canConnect,
        canDisconnect: cassette.current.canDisconnect,
        canInsert: cassette.current.canInsert,
        canEject: cassette.current.canEject,
        canRecord: cassette.current.canRecord,
        canPlay: cassette.current.canPlay,
        canPause: cassette.current.canPause,
        canScan: cassette.current.canScan,
        canUnlink: cassette.current.canUnlink
    }), []);

    const defaultOnProgress = React.useCallback((progress: number, duration: number) => {
        setProgress(progress);
        setDuration(duration);
    }, []);

    const defaultOnStatus = React.useCallback((status: CassetteStatus) => {
        setStatus(status);
        setFlags(getFlags());
    }, [getFlags]);

    const defaultOnAnalysis = React.useCallback((analysis: Partial<CassetteAnalyserEmissions>) => {
        setAnalysis(analysis);
    }, [])

    const defaultOnError = React.useCallback((error: unknown) => {
        setError(error);
    }, []);

    // Mounting and Unmounting

    if (!cassette.current) {
        const params = { clockOptions, analyserOptions };
        const cbs = { 
            onProgress: onProgress || defaultOnProgress, 
            onStatus: onStatus || defaultOnStatus, 
            onAnalysis: onAnalysis || defaultOnAnalysis,
            onError: onError || defaultOnError
        };
        cassette.current = new Cassette({...params, ...cbs});
    }

    React.useEffect(() => {
        return () => cassette.current.canUnlink && cassette.current.unlink();
    }, []);

    // Manage Params

    const prevClockOptions = React.useRef(clockOptions);
    const prevAnalyserOptions = React.useRef(analyserOptions);
    const prevOnProgress = React.useRef(onProgress);
    const prevOnStatus = React.useRef(onStatus);
    const prevOnAnalysis = React.useRef(onAnalysis);
    const prevOnError = React.useRef(onError);

    React.useEffect(() => {
        if (!isEqual(clockOptions, prevClockOptions.current)) {
            prevClockOptions.current = clockOptions;
            cassette.current.clockOptions = clockOptions;
        }
    }, [clockOptions]);

    React.useEffect(() => {
        if (!isEqual(analyserOptions, prevAnalyserOptions.current)) {
            prevAnalyserOptions.current = analyserOptions;
            cassette.current.analyserOptions = analyserOptions;
        }
    }, [analyserOptions]);

    React.useEffect(() => {
        if (!isEqual(onProgress, prevOnProgress.current)) {
            prevOnProgress.current = onProgress;
            cassette.current.onProgress = onProgress || defaultOnProgress;
        }
    }, [onProgress, defaultOnProgress]);

    React.useEffect(() => {
        if (!isEqual(onStatus, prevOnStatus.current)) {
            prevOnStatus.current = onStatus;
            cassette.current.onStatus = onStatus || defaultOnStatus;
        }
    }, [onStatus, defaultOnStatus]);

    React.useEffect(() => {
        if (!isEqual(onAnalysis, prevOnAnalysis.current)) {
            prevOnAnalysis.current = onAnalysis;
            cassette.current.onAnalysis = onAnalysis || defaultOnAnalysis;
        }
    }, [onAnalysis, defaultOnAnalysis]);

    React.useEffect(() => {
        if (!isEqual(onError, prevOnError.current)) {
            prevOnError.current = onError;
            cassette.current.onError = onError || defaultOnError;
        }
    }, [onError, defaultOnError]);

    // State and Return Structure

    const [progress, setProgress] = React.useState(cassette.current.progress);
    const [duration, setDuration] = React.useState(cassette.current.duration);
    const [status, setStatus] = React.useState(cassette.current.status);
    const [flags, setFlags] = React.useState(getFlags());
    const [analysis, setAnalysis] = React.useState<Partial<CassetteAnalyserEmissions>>({});
    const [error, setError] = React.useState<unknown>();

    const controls = React.useMemo(() => ({
        connect: async (stream: MediaStream, cb?: CassetteErrorCallback) => await cassette.current.connect(stream, cb),
        disconnect: async (cb?: CassetteErrorCallback) => await cassette.current.disconnect(cb),
        insert: async (file: WavObject | Blob, cb?: CassetteErrorCallback ) => await cassette.current.insert(file, cb),
        eject: async (cb?: CassetteErrorCallback): Promise<WavObject | null> => await cassette.current.eject(cb),
        record: async (cb?: CassetteErrorCallback) => await cassette.current.record(cb),
        play: async (cb?: CassetteErrorCallback) => await cassette.current.play(cb),
        pause: async (cb?: CassetteErrorCallback) => await cassette.current.pause(cb),
        scanTo: async (secs: number, cb?: CassetteErrorCallback) => await cassette.current.scanTo(secs, cb),
        scanBy: async (secs: number, cb?: CassetteErrorCallback) => await cassette.current.scanBy(secs, cb),
        unlink: async (cb?: CassetteErrorCallback) => await cassette.current.unlink(cb)
    }), []);

    return {
        controls,
        progress,
        duration,
        status,
        flags,
        analyser: cassette.current.analyser,
        analysis,
        error
    }
}

export default useCassette;