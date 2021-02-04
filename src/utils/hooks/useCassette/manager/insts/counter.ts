import { msInSecs } from '../utils/timingUtils';

function counterInstance(ctx: {[key : string]: any}): {end: () => void} {
    const incrementInSecs = msInSecs(ctx.increment);

    let prev = ctx.audioCtx.currentTime;
    let totalElapsed = ctx.progress;
    let totalDuration = ctx.duration;
    let timeSinceDispatch = 0;

    let animation = requestAnimationFrame(checkElapsed);

    function checkElapsed() {
        animation = requestAnimationFrame(checkElapsed);

        const newElapsed = ctx.audioCtx.currentTime - prev;
        prev = ctx.audioCtx.currentTime;

        totalElapsed += newElapsed;
        totalElapsed > totalDuration && (totalDuration = totalElapsed);
        timeSinceDispatch += newElapsed;

        if (timeSinceDispatch >= incrementInSecs) {
            timeSinceDispatch = 0;
            ctx.dispatcher({key: 'tapeProgress', args: {
                progress: totalElapsed,
                duration: totalDuration,
                increment: ctx.increment
            }});
        }
    }

    return {
        end: function () {
            cancelAnimationFrame(animation);
            ctx.counter = null;
        }
    };
}

export default counterInstance;