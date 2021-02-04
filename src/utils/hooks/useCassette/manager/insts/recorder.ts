import counterInstance from './counter';
import workerInstance from './worker';
import { spliceBlobWithBuffer } from '../utils/bufferUtils';

async function recorderInstance(ctx: {[key : string]: any}): Promise<void> {
    await navigator
    .mediaDevices
    .getUserMedia({audio: true})
    .then(stream => {
        ctx.recorder = new MediaRecorder(stream, {audioBitsPerSecond: ctx.bitsPerSecond});

        ctx.recorder.onstart = () => {
            ctx.streamSource = ctx.audioCtx.createMediaStreamSource(ctx.recorder.stream);
            ctx.streamSource.connect(ctx.analyser);
            ctx.recStart = ctx.progress;
            ctx.counter = counterInstance(ctx);
            ctx.encodingWorker?.terminate();
            ctx.dispatcher({key: 'recStarted'});
        };

        ctx.recorder.stream.getTracks()[0].onended = () => {
            ctx.dispatcher({key: 'disconnected'});
        };

        ctx.recorder.ondataavailable = (e: {data: Blob}) => {
            ctx.tempBlob = e.data;
        };

        ctx.recorder.onstop = () => {
            ctx.streamSource?.disconnect();
            ctx.streamSource = null;
            ctx.counter?.end();
            ctx.counter = null;
            ctx.dispatcher({key: 'recEnded'});

            spliceBlobWithBuffer(
                ctx.audioCtx,
                ctx.workingAudioBuffer,
                ctx.tempBlob,
                ctx.recStart
            , (prog?: number, newBuffer?: AudioBuffer) => {
                if (prog) ctx.progress = prog;
                if (newBuffer) {
                    ctx.workingAudioBuffer = newBuffer;
                    ctx.duration = newBuffer.duration;
                    ctx.encodingWorker = workerInstance(ctx);
                }
                ctx.tempBlob = null;
                ctx.dispatcher({key: 'tapeProgress', args: {
                    progress: ctx.progress,
                    duration: ctx.duration,
                    increment: ctx.increment
                }});
                ctx.dispatcher({key: 'recBuffered'});
            });  
        };

        ctx.recorder.onerror = (e: {error: Error}) => {
            ctx.streamSource?.disconnect();
            ctx.streamSource = null;
            ctx.counter?.end();
            ctx.counter = null;
            ctx.dispatcher({key: 'recError', args: e.error});
        };

        ctx.dispatcher({key: 'connected'});
    });
}

export default recorderInstance;