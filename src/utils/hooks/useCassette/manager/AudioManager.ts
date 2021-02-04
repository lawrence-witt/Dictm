import recorderInst from './insts/recorder';
import playBackInst from './insts/player';
import dispatcherInst from './insts/dispatch';
import * as timingUtils from './utils/timingUtils';

import { 
    KeyedAnyObject,
    KeyedBooleanObject, 
    KeyedAnalyserNode, 
    AnalyserOpts, 
    AnalyserGets,
    ParamOptions 
} from '../commonTypes';
import { ManagerExceptions, Dispatches } from './managerTypes';

class AudioManager {
    [key: string] : any;
    audioCtx: AudioContext;
    analyser: KeyedAnalyserNode;
    recorder: MediaRecorder | null;
    playBack: {end: () => void} | null;
    streamSource: MediaStreamAudioSourceNode | null;
    bufferSource: AudioBufferSourceNode | null;
    workingAudioBuffer: AudioBuffer | null;
    tempBlob: Blob | null;
    encodingWorker: {terminate: () => void} | null;
    increment: number;
    bitsPerSecond: number | null;
    analyserOptions: AnalyserOpts;
    minMs: 10;
    progress: number;
    duration: number;
    recStart: number;
    counter: {end: () => void} | null;
    resumeTimeout: any;
    dispatcher: ({key, args}: Dispatches) => void;

    constructor(stamp: number, params?: ParamOptions) {
        // Web Audio API
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.recorder = null;
        this.playBack = null;
        this.streamSource = null;
        this.bufferSource = null;
        // Working Data
        this.workingAudioBuffer = null;
        this.tempBlob = null;
        // Encoding
        this.encodingWorker = null;
        // User Params
        this.increment = 100;
        this.bitsPerSecond = 128000;
        this.analyserOptions = {};
        // Timing
        this.minMs = 10;
        this.progress = 0;
        this.duration = 0;
        this.recStart = 0;
        this.counter = null;
        this.resumeTimeout = null;
        // Dispatcher
        this.dispatcher = dispatcherInst(stamp);
        // Initialise
        this._init(params);
    }

    // Initialise with user parameters
    _init(params?: ParamOptions): void {
        if (!params || Object.getPrototypeOf(params) !== Object.prototype) return;
        
        const { analyserOptions, ...rest } = params;

        const validFile = rest.file && rest.file instanceof Blob;
        const validInc = rest.increment && typeof rest.increment === 'number';
        const validBps = rest.bitsPerSecond && typeof rest.bitsPerSecond === 'number';
        const validAnalyserOpts = [
            "fftSize", 
            "maxDecibels", 
            "minDecibels", 
            "smoothingTimeConstant"
        ];

        if (validInc) {
            this.increment = Math.max(this.minMs, rest.increment);
        }

        if (validBps && !validFile) {
            this.bitsPerSecond = rest.bitsPerSecond;
        }

        if (validFile) {
            this.dispatcher({key: 'fileSelected'});
            (async () => {
                try {
                    const decoded = await this.audioCtx.decodeAudioData(await rest.file.arrayBuffer());
                    this.workingAudioBuffer = decoded;
                    this.duration = decoded.duration;

                    // Calculate bps
                    const kbit = rest.file.size/128;
                    const kbps = Math.ceil(Math.round(kbit/this.duration)/16)*16;
                    this.bitsPerSecond = kbps*1000;

                    this.dispatcher({key: 'fileBuffered', args: {
                        duration: this.duration,
                        increment: this.increment
                    }});
                } catch (err) {
                    this.dispatcher({key: 'fileError', args: err});
                }
            })();
        }

        const filteredAnalyserOptions: AnalyserOpts = {};

        Object.keys(analyserOptions || {}).forEach(key => {
            if (validAnalyserOpts.includes(key) && typeof analyserOptions[key] === 'number') {
                this.analyser[key] = analyserOptions[key];
                filteredAnalyserOptions[key] = analyserOptions[key];
            }
        });

        this.analyserOptions = filteredAnalyserOptions;
    }

    _queueMethod(exceptions: ManagerExceptions[], fn: () => void): void {
        const errorSchema: KeyedBooleanObject = {
            NoRecorder: !this.recorder?.stream.active,
            RecorderActive: this.recorder?.state === 'recording',
            RecorderInactive: this.recorder?.state !== 'recording',
            PlayBackActive: this.playBack ? true : false,
            PlayBackInactive: !this.playBack,
            NoBuffer: !this.workingAudioBuffer,
            Buffering: this.tempBlob ? true : false
        };

        const error = exceptions.find(key => errorSchema[key]);
        if (!error) {
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().then(fn);
            } else {
                fn();
            }
        }
    }

    // Connect media recorder
    connect(): void {
        this._queueMethod([], async () => {
            try {
                if (this.recorder?.stream.active) throw new DOMException(undefined, 'RecorderExistsError');
    
                await recorderInst(this);
            } catch (err) {
                this.dispatcher({key: 'connectError', args: err.name});
            }
        })
    }

    // Disconnect media recorder
    disconnect(): void {
        this._queueMethod([
            'NoRecorder'
        ], () => {
            this.recorder.stream.getTracks()[0].stop();
            this.recorder.stream.getTracks()[0].dispatchEvent(new Event('ended'));
        });
    }

    // Start recording audio
    record(): void {
        this._queueMethod([
            'NoRecorder', 
            'RecorderActive', 
            'PlayBackActive', 
            'Buffering'
        ], () => {
            this.recorder.start();
        })
    }

    // Begin playback from the workingAudioBuffer
    play(): void {
        this._queueMethod([
            'RecorderActive', 
            'PlayBackActive',
            'NoBuffer', 
            'Buffering'
        ], () => {
            if (this.progress === this.duration) this.progress = 0;
            this.playBack = playBackInst(this);
        });
    }

    // Generic pause method
    pause(): void {
        if (this.recorder?.state === 'recording') {
            this.pauseRecording();
        } else if (this.playBack) {
            this.pausePlayBack();
        }
    }

    // Pause an active recording session
    pauseRecording():void {
        this._queueMethod([
            'NoRecorder',
            'RecorderInactive'
        ], () => {
            this.recorder.stop();
        });
    }

    // Pause playback of the workingAudioBuffer
    pausePlayBack():void {
        this._queueMethod([
            'PlayBackInactive'
        ], () => {
            this.playBack.end();
        });
    }

    // Scan progress backwards and forwards through available duration
    scan(ms: number, forward: boolean): void {
        this._queueMethod([
            'RecorderActive',
            'NoBuffer',
            'Buffering'
        ], () => {
            const msInSecs = timingUtils.msInSecs(ms);
            const getNewProgress = () => (
                Math.min(this.duration, Math.max(
                    0, this.progress + (forward ? msInSecs : -msInSecs)))
            );
            const dispatchProgress = () => this.dispatcher({key: 'tapeProgress', args: {
                progress: this.progress,
                duration: this.duration,
                increment: this.increment
            }});
            const scheduleResume = () => {
                this.resumeTimeout && clearTimeout(this.resumeTimeout);
                this.resumeTimeout = setTimeout(() => {
                    this.play();
                    this.resumeTimeout = null;
                }, 500);
            };

            if (this.playBack) {
                const onPlayBackEnded = () => {
                    this.progress = getNewProgress();
                    dispatchProgress();
                    scheduleResume();
                    window.removeEventListener('cassette_play_ended', onPlayBackEnded);
                };

                window.addEventListener('cassette_play_ended', onPlayBackEnded);
                this.pausePlayBack();
            } else {
                this.progress = getNewProgress();
                dispatchProgress();
                this.resumeTimeout && scheduleResume();
            }
        });
    }

    // Return user requests for analyser data
    getAnalyser(prop: AnalyserGets, arg?: Float32Array | Uint8Array): unknown {
        const getSchema: KeyedAnyObject = {
            fftSize: () => this.analyser.fftSize,
            frequencyBinCount: () => this.analyser.frequencyBinCount,
            maxDecibels: () => this.analyser.maxDecibels,
            minDecibels: () => this.analyser.minDecibels,
            smoothingTimeConstant: () => this.analyser.smoothingTimeConstant,
            floatFrequencyData: (float32: Float32Array) => this.analyser.getFloatFrequencyData(float32),
            byteFrequencyData: (unit8: Uint8Array) => this.analyser.getByteFrequencyData(unit8),
            floatTimeDomainData: (float32: Float32Array) => this.analyser.getFloatTimeDomainData(float32),
            byteTimeDomainData: (unit8: Uint8Array) => this.analyser.getByteTimeDomainData(unit8)
        };

        if (getSchema[prop]) {
            return getSchema[prop](arg);
        }
    }

    // Cancel any active processes and dispatch reset
    unlink(): void {
        this.playBack?.end();
        this.recorder?.stream.getTracks()[0].stop();
        this.encodingWorker?.terminate();
        this.dispatcher({key: "reset"});
    }
}

export default AudioManager;