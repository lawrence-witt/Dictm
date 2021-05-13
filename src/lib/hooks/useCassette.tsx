import React from 'react';
import isEqual from 'react-fast-compare';
import Cassette, { 
    CassetteParams,
    CassettePublicMethods,
    CassetteStatus,
    CassettePublicFlags,
    WavEncoder
} from 'cassette-js';

export interface CassetteGetters {
    context: () => AudioContext;
    status: () => CassetteStatus;
    flags: () => CassettePublicFlags;
    progress: () => number;
    duration: () => number;
    track: () => Cassette<"wav">["track"];
}

interface CassetteReturn {
    progress: number;
    duration: number;
    status: CassetteStatus;
    flags: CassettePublicFlags;
    controls: CassettePublicMethods<"wav">;
    get: CassetteGetters;
}

const useCassette = (
    increment?: CassetteParams["increment"],
    floorOutput?: CassetteParams["floorOutput"],
    onProgress?: CassetteParams["onProgress"],
    onStatus?: CassetteParams["onStatus"]
): CassetteReturn => {
    
    // Base Class
    const cassette = React.useRef() as React.MutableRefObject<Cassette<"wav">>;

    // Utility Callbacks

    const defaultOnProgress = React.useCallback((progress: number, duration: number) => {
        setProgress(progress);
        setDuration(duration);
    }, []);

    const defaultOnStatus = React.useCallback((status: CassetteStatus, flags: CassettePublicFlags) => {
        setStatus(status);
        setFlags(flags);
    }, []);

    // Mounting and Unmounting

    if (!cassette.current) {
        const options = {
            increment,
            floorOutput,
            onProgress: onProgress || defaultOnProgress,
            onStatus: onStatus || defaultOnStatus
        }
        cassette.current = new Cassette(WavEncoder, options);
    }

    React.useEffect(() => {
        return () => {
            if (cassette.current.flags.canUnlink) {
                cassette.current.onProgress = null;
                cassette.current.onStatus = null;
                cassette.current.unlink();
            }
        };
    }, []);

    // Manage Params

    const prevOnProgress = React.useRef(onProgress);
    const prevOnStatus = React.useRef(onStatus);

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

    // State and Return Structure

    const [progress, setProgress] = React.useState(cassette.current.progress);
    const [duration, setDuration] = React.useState(cassette.current.duration);
    const [status, setStatus] = React.useState(cassette.current.status);
    const [flags, setFlags] = React.useState(cassette.current.flags);

    const controls: CassettePublicMethods<"wav"> = React.useMemo(() => ({
        connect: async (stream, cb?) => await cassette.current.connect(stream, cb),
        disconnect: async (cb?) => await cassette.current.disconnect(cb),
        insert: async (file, cb?) => await cassette.current.insert(file, cb),
        eject: async (cb?) => await cassette.current.eject(cb),
        record: async (nodes?, cb?) => await cassette.current.record(nodes, cb),
        play: async (nodes?, cb?) => await cassette.current.play(nodes, cb),
        pause: async (cb?) => await cassette.current.pause(cb),
        scanTo: async (secs, cb?) => await cassette.current.scanTo(secs, cb),
        scanBy: async (secs, cb?) => await cassette.current.scanBy(secs, cb),
        unlink: async (closeContext?, cb?) => await cassette.current.unlink(closeContext, cb)
    }), []);

    const get = React.useMemo(() => ({
        context: () => cassette.current.context,
        status: () => cassette.current.status,
        flags: () => cassette.current.flags,
        progress: () => cassette.current.progress,
        duration: () => cassette.current.duration,
        track: () => cassette.current.track
    }), []);

    return {
        progress,
        duration,
        status,
        flags,
        controls,
        get
    }
}

export default useCassette;