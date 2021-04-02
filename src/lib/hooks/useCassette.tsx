import React from 'react';
import isEqual from 'react-fast-compare';
import Cassette, { 
    CassetteUserParams,
    CassettePublicMethods,
    CassetteStatus,
    CassettePublicFlags,
    CassetteNodeMap,
    CassetteErrorCallback,
    WavObject
} from 'cassette-js';

/*  
*   REMEMBER TO UNLINK CASSETTE-JS **HERE FIRST** 
*   BEFORE MAKING DEP/PATH CHANGES TO EITHER 
*/

export interface CassetteGetters {
    context: () => AudioContext;
    status: () => CassetteStatus;
    flags: () => CassettePublicFlags;
    progress: () => number;
    duration: () => number;
    wavData: () => WavObject | null;
    nodeMap: () => CassetteNodeMap;
}

interface CassetteReturn {
    progress: number;
    duration: number;
    status: CassetteStatus;
    flags: CassettePublicFlags;
    controls: CassettePublicMethods;
    get: CassetteGetters;
    error: unknown;
}

const useCassette = (
    increment?: CassetteUserParams["increment"],
    floorOutput?: CassetteUserParams["floorOutput"],
    onProgress?: CassetteUserParams["onProgress"],
    onStatus?: CassetteUserParams["onStatus"],
    onError?: CassetteUserParams["onError"]
): CassetteReturn => {
    
    // Base Class
    const cassette = React.useRef() as React.MutableRefObject<Cassette>;

    // Utility Callbacks

    const defaultOnProgress = React.useCallback((progress: number, duration: number) => {
        setProgress(progress);
        setDuration(duration);
    }, []);

    const defaultOnStatus = React.useCallback((status: CassetteStatus, flags: CassettePublicFlags) => {
        setStatus(status);
        setFlags(flags);
    }, []);

    const defaultOnError = React.useCallback((error: unknown) => {
        setError(error);
    }, []);

    // Mounting and Unmounting

    if (!cassette.current) {
        const params = { increment, floorOutput };
        const cbs = { 
            onProgress: onProgress || defaultOnProgress, 
            onStatus: onStatus || defaultOnStatus,
            onError: onError || defaultOnError
        };
        cassette.current = new Cassette({...params, ...cbs});
    }

    React.useEffect(() => {
        return () => {
            if (cassette.current.flags.canUnlink) {
                cassette.current.onProgress = null;
                cassette.current.onStatus = null;
                cassette.current.onError = null;
                cassette.current.unlink();
            }
        };
    }, []);

    // Manage Params

    const prevOnProgress = React.useRef(onProgress);
    const prevOnStatus = React.useRef(onStatus);
    const prevOnError = React.useRef(onError);

    React.useEffect(() => {
        if (increment) cassette.current.increment = increment;
        if (floorOutput) cassette.current.floorOutput = floorOutput;
    }, [increment, floorOutput]);

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
        if (!isEqual(onError, prevOnError.current)) {
            prevOnError.current = onError;
            cassette.current.onError = onError || defaultOnError;
        }
    }, [onError, defaultOnError]);

    // State and Return Structure

    const [progress, setProgress] = React.useState(cassette.current.progress);
    const [duration, setDuration] = React.useState(cassette.current.duration);
    const [status, setStatus] = React.useState(cassette.current.status);
    const [flags, setFlags] = React.useState(cassette.current.flags);
    const [error, setError] = React.useState<unknown>();

    const controls: CassettePublicMethods = React.useMemo(() => ({
        connect: async (stream, cb?) => await cassette.current.connect(stream, cb),
        disconnect: async (cb?) => await cassette.current.disconnect(cb),
        insert: async (file, cb?) => await cassette.current.insert(file, cb),
        eject: async (cb?: CassetteErrorCallback): Promise<WavObject | null> => await cassette.current.eject(cb),
        addNode: async (n, rI?, pI?, cb?) => await cassette.current.addNode(n, rI, pI, cb),
        modifyNode: async (n, rI?, pI?, cb?) => await cassette.current.modifyNode(n, rI, pI, cb),
        removeNodes: async (n, cb?) => await cassette.current.removeNodes(n, cb),
        record: async (cb?) => await cassette.current.record(cb),
        play: async (cb?) => await cassette.current.play(cb),
        pause: async (cb?) => await cassette.current.pause(cb),
        scanTo: async (secs, cb?) => await cassette.current.scanTo(secs, cb),
        scanBy: async (secs, cb?) => await cassette.current.scanBy(secs, cb),
        unlink: async (cb?) => await cassette.current.unlink(cb)
    }), []);

    const get = React.useMemo(() => ({
        context: () => cassette.current.context,
        status: () => cassette.current.status,
        flags: () => cassette.current.flags,
        progress: () => cassette.current.progress,
        duration: () => cassette.current.duration,
        wavData: () => cassette.current.wavData,
        nodeMap: () => cassette.current.nodeMap
    }), []);

    return {
        progress,
        duration,
        status,
        flags,
        controls,
        get,
        error
    }
}

export default useCassette;