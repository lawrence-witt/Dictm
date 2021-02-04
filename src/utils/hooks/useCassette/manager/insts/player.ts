import counterInstance from './counter';

function playBackInstance(ctx: {[key : string]: any}): {end: () => void} {
    ctx.dispatcher({key: 'playStarted'});

    const startedAt = ctx.audioCtx.currentTime;
    let complete = true;

    try {
        ctx.bufferSource = ctx.audioCtx.createBufferSource();
        ctx.bufferSource.buffer = ctx.workingAudioBuffer;
        ctx.bufferSource.connect(ctx.analyser);
        ctx.bufferSource.connect(ctx.audioCtx.destination);
    
        ctx.bufferSource.start(0, ctx.progress);
        ctx.counter = counterInstance(ctx);
    
        ctx.bufferSource.onended = () => {
            ctx.counter?.end();
            if (complete) {
                ctx.progress = ctx.workingAudioBuffer.duration;
            } else {
                ctx.progress += (ctx.audioCtx.currentTime - startedAt);
            }
            ctx.bufferSource?.disconnect();
            ctx.bufferSource = null;
            ctx.playBack = null;
            ctx.dispatcher({key: 'tapeProgress', args: {
                progress: ctx.progress,
                duration: ctx.duration,
                increment: ctx.increment
            }});
            ctx.dispatcher({key: 'playEnded'});   
        };
    } catch (err) {
        complete = false;
        ctx.bufferSource?.stop();
        ctx.bufferSource = null;
        ctx.playBack = null;
        ctx.dispatcher({key: 'playError', args: err});
    }

    return {
        end: function () {
            complete = false;
            ctx.bufferSource.stop();
        }
    };
}

export default playBackInstance;