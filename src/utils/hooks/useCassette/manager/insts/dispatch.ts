import { floorSecsByMs } from '../utils/timingUtils';

import { KeyedAnyObject } from '../../commonTypes';
import { Dispatches } from '../managerTypes';

// Event 
export const RESET = "cassette_reset";

export const FILE_SELECTED = "cassette_file_selected";
export const FILE_BUFFERED = "cassette_file_buffered";
export const FILE_ERROR = "cassette_file_error";

export const CONNECTED = "cassette_connected";
export const DISCONNECTED = "cassette_disconnected";
export const CONNECT_ERROR = "cassette_connect_error";

export const TAPE_PROGRESS = "cassette_tape_progress";

export const REC_STARTED = "cassette_rec_started";
export const REC_ENDED = "cassette_rec_ended";
export const REC_BUFFERED = "cassette_rec_buffered";
export const REC_ERROR = "cassette_rec_error";

export const ENCODE_STARTED = "cassette_encode_started";
export const ENCODE_PROGRESS = "cassette_encode_progress";
export const ENCODE_ENDED = "cassette_encode_ended";
export const ENCODE_ERROR = "cassette_encode_error";

export const PLAY_STARTED = "cassette_play_started";
export const PLAY_ENDED = "cassette_play_ended";
export const PLAY_ERROR = "cassette_play_error";

// Event Dispatcher
function dispatcherInstance(stamp: number): ({key, args}: Dispatches) => void {
    // Event Constructor
    const customEvent = (string: string, data?: any) => {
        return new CustomEvent(string, {detail: {
            stamp,
            data
        }});
    };

    // Event Schema
    const schema: KeyedAnyObject = {
        reset: () => customEvent(RESET),
        
        fileSelected: () => customEvent(FILE_SELECTED),
        fileBuffered: (args: {duration: number, increment: number}) => {
            const flooredDuration = floorSecsByMs(args.duration, args.increment);
            return customEvent(FILE_BUFFERED, flooredDuration);
        },
        fileError: () => customEvent(FILE_ERROR),

        connected: () => customEvent(CONNECTED),
        disconnected: () => customEvent(DISCONNECTED),
        connectError: (err: Error) => customEvent(CONNECT_ERROR, err),

        tapeProgress: (args: {progress: number, duration: number, increment: number}) => {
            const flooredProgress = floorSecsByMs(args.progress, args.increment);
            const flooredDuration = floorSecsByMs(args.duration, args.increment);
            return customEvent(TAPE_PROGRESS, {progress: flooredProgress, duration: flooredDuration});
        },

        recStarted: () => customEvent(REC_STARTED),
        recEnded: () => customEvent(REC_ENDED),
        recBuffered: () => customEvent(REC_BUFFERED),
        recError: (err: Error) => customEvent(REC_ERROR, err),

        encodeStarted: () => customEvent(ENCODE_STARTED),
        encodeProgress: (percent: number) => customEvent(ENCODE_PROGRESS, percent),
        encodeEnded: (blob: Blob) => customEvent(ENCODE_ENDED, blob),
        encodeError: (err: string) => customEvent(ENCODE_ERROR, err),

        playStarted: () => customEvent(PLAY_STARTED),
        playEnded: () => customEvent(PLAY_ENDED),
        playError: (err: Error) => customEvent(PLAY_ERROR, err)
    };

    return ({key, args}: Dispatches) => {
        schema[key] && window.dispatchEvent(schema[key](args));
    };
}

export default dispatcherInstance;