import React from 'react';
import useOptionsControl from './useOptionsControl';
import * as events from '../manager/insts/dispatch';
import reducer, { initialState } from './reducer';

import { AnalyserGets } from '../commonTypes';
import { 
    CassetteParams,
    Actions, 
    BaseDetail, 
    TapeProgressDetail, 
    NumberDetail, 
    BlobDetail, 
    ErrorDetail, 
    CassetteReturn 
} from './hookTypes';

function useCassette(params?: CassetteParams): CassetteReturn {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const stamp = React.useRef(Date.now());
    const Manager = React.useRef(null);


    // State Selectors
    const { id, hasStream, hasData, isBuffering } = state;

    const active = id === 'playing' || id === 'recording';
    const canConnect = !hasStream;
    const canRecord = !active && hasStream && !isBuffering;
    const canPlay = !active && hasData && !isBuffering;
    const canPause = active;
    const canScan = id !== 'recording' && hasData && !isBuffering;


    // Mutable callbacks
    const onError = params?.onError;
    const onTapeProgress = params?.onTapeProgress;
    const onEncodeProgress = params?.onEncodeProgress;

    const onErrorCb = React.useRef(onError);
    const onTapeProgressCb = React.useRef(onTapeProgress);
    const onEncodeProgressCb = React.useRef(onEncodeProgress);

    React.useEffect(() => {
        onError && (onErrorCb.current = onError);
        onTapeProgress && (onTapeProgressCb.current = onTapeProgress);
        onEncodeProgress && (onEncodeProgressCb.current = onEncodeProgress);
    }, [onError, onTapeProgress, onEncodeProgress]);


    // User Exposed Methods
    const connect = React.useCallback(() => Manager.current && Manager.current.connect(), []);
    const disconnect = React.useCallback(() => Manager.current && Manager.current.disconnect(), []);
    const record = React.useCallback(() => Manager.current && Manager.current.record(), []);
    const play = React.useCallback(() => Manager.current && Manager.current.play(), []);
    const pause = React.useCallback(() => Manager.current && Manager.current.pause(), []);
    const scan = React.useCallback((ms: number, forward: boolean) => (
        Manager.current && Manager.current.scan(ms, forward)
    ), []);
    const getAnalyser = React.useCallback((prop: AnalyserGets, arg?: Float32Array | Uint8Array) => (
        Manager.current && Manager.current.getAnalyser(prop, arg)
    ), []);


    // Event Listeners
    React.useEffect(() => {
        const validStamp = (eventStamp: number) => (
            eventStamp === stamp.current
        );

        const validateDispatch = (
            action: Actions, 
            eventStamp: number, 
            cb?: () => void,
        ) => {
            if (!validStamp(eventStamp)) return;
            dispatch(action);
            cb && cb();
        };

        const dispatchSchema: {[key: string]: (args: unknown) => void} = {
            [events.RESET]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'reset'}, detail.stamp, () => {
                    onTapeProgressCb.current && onTapeProgressCb.current(0, 0);
                    onEncodeProgressCb.current && onEncodeProgressCb.current(0);
                });
            },
            [events.FILE_SELECTED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'fileSelected'}, detail.stamp);
            },
            [events.FILE_BUFFERED]: ({detail}: {detail: NumberDetail}) => {
                validateDispatch({type: 'fileBuffered', payload: detail.data}, detail.stamp);
            },
            [events.FILE_ERROR]: ({detail}: {detail: ErrorDetail}) => {
                validateDispatch({type: 'fileError'}, detail.stamp, () => {
                    onErrorCb.current && onErrorCb.current('file', detail.data);
                });
            },
            [events.CONNECTED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'connected'}, detail.stamp);
            },
            [events.DISCONNECTED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'disconnected'}, detail.stamp);
            },
            [events.CONNECT_ERROR]: ({detail}: {detail: ErrorDetail}) => {
                validateDispatch({type: "connectError"}, detail.stamp, () => {
                    onErrorCb.current && onErrorCb.current('connect', detail.data);
                });
            },
            [events.TAPE_PROGRESS]: ({detail}: {detail: TapeProgressDetail}) => {
                if (onTapeProgressCb.current) {
                    onTapeProgressCb.current(detail.data.progress, detail.data.duration);
                } else {
                    validateDispatch({type: 'tapeProgress', payload: {
                        progress: detail.data.progress,
                        duration: detail.data.duration
                    }}, detail.stamp);
                }
            },
            [events.REC_STARTED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'recStarted'}, detail.stamp);
            },
            [events.REC_ENDED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'recEnded'}, detail.stamp);
            },
            [events.REC_BUFFERED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'recBuffered'}, detail.stamp);
            },
            [events.REC_ERROR]: ({detail}: {detail: ErrorDetail}) => {
                validateDispatch({type: "recError"}, detail.stamp, () => {
                    onErrorCb.current && onErrorCb.current('record', detail.data);
                });
            },
            [events.ENCODE_STARTED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'encodeStarted'}, detail.stamp, () => {
                    onEncodeProgressCb.current && onEncodeProgressCb.current(0);
                });
            },
            [events.ENCODE_PROGRESS]: ({detail}: {detail: NumberDetail}) => {
                if (onEncodeProgressCb.current) {
                    onEncodeProgressCb.current(detail.data);
                } else {
                    validateDispatch({type: 'encodeProgress', payload: detail.data}, detail.stamp);
                }
            },
            [events.ENCODE_ENDED]: ({detail}: {detail: BlobDetail}) => {
                validateDispatch({type: 'encodeEnded', payload: detail.data}, detail.stamp);
            },
            [events.ENCODE_ERROR]: ({detail}: {detail: ErrorDetail}) => {
                validateDispatch({type: "encodeError"}, detail.stamp, () => {
                    onErrorCb.current && onErrorCb.current('encode', detail.data);
                });
            },
            [events.PLAY_STARTED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'playStarted'}, detail.stamp);
            },
            [events.PLAY_ENDED]: ({detail}: {detail: BaseDetail}) => {
                validateDispatch({type: 'playEnded'}, detail.stamp);
            },
            [events.PLAY_ERROR]: ({detail}: {detail: ErrorDetail}) => {
                validateDispatch({type: "playError"}, detail.stamp, () => {
                    onErrorCb.current && onErrorCb.current('play', detail.data);
                });
            }
        };

        Object.keys(dispatchSchema).forEach(key => {
            window.addEventListener(key, dispatchSchema[key]);
        });

        return () => {
            Object.keys(dispatchSchema).forEach(key => {
                window.removeEventListener(key, dispatchSchema[key]);
            });
        };
    }, []);


    // Initialise, unmount, and respond to option changes
    const {current: blankOptions} = React.useRef({});
    const options = params?.options || blankOptions;
    useOptionsControl(stamp, Manager, options);

    // Memoised returns
    const status = React.useMemo(() => ({
        id, canConnect, canRecord, canPlay, canPause, canScan
    }), [id, canConnect, canRecord, canPlay, canPause, canScan]);

    const tape = React.useMemo(() => ({
        progress: state.tapeProgress,
        duration: state.tapeDuration
    }), [state.tapeProgress, state.tapeDuration]);

    const encoded = React.useMemo(() => ({
        percent: state.encodePercent,
        blob: state.encodedBlob
    }), [state.encodePercent, state.encodedBlob]);

    const controls = React.useMemo(() => ({
        connect, 
        disconnect, 
        record, 
        play, 
        pause, 
        fastForward: (ms: number) => scan(ms, true), 
        rewind: (ms: number) => scan(ms, false), 
        getAnalyser
    }), [connect, disconnect, record, play, pause, scan, getAnalyser]);


    // Return structure
    return {
        status,
        tape,
        encoded,
        controls
    };
}

export default useCassette;