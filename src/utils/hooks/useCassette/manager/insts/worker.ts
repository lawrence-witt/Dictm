function workerInstance(ctx: {[key : string]: any}): {terminate: () => void} {
    ctx.dispatcher({key: 'encodeStarted'});

    const worker = new Worker(new URL("../workers/mp3.js", import.meta.url));

    const data: {
        numChannels: number, 
        sampleRate: number, 
        float32Channels: Float32Array[],
        kbps: number
    } = {
        numChannels: ctx.workingAudioBuffer.numberOfChannels,
        sampleRate: ctx.workingAudioBuffer.sampleRate,
        float32Channels: [],
        kbps: Math.round((ctx.recorder.audioBitsPerSecond)/1000)
    };

    for (let i = 0; i < data.numChannels; i++) {
        data.float32Channels.push(ctx.workingAudioBuffer.getChannelData(i));
    }

    worker.postMessage(data);

    worker.onmessage = function(event) {
        const { type, payload } = event.data;

        if (type === 'progress') {
            ctx.dispatcher({key: 'encodeProgress', args: payload});
        } else if (type === 'complete') {
            const newBlob = new Blob(payload, {type: 'audio/mpeg'});
            ctx.dispatcher({key: 'encodeEnded', args: newBlob});
            worker.terminate();
            ctx.encodingWorker = null;
        }
    };

    worker.onerror = function() {
        ctx.dispatcher({key: 'encodeError', args: 'Audio buffer could not be encoded.'});
    };

    return {
        terminate: () => {
            worker.terminate();
            ctx.encodingWorker = null;
        }
    }
}

export default workerInstance;