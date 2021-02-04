function sliceAudioBuffer(
    ctx: AudioContext, 
    buffer: AudioBuffer, 
    start: number, 
    end: number
) {
    const duration = buffer.duration;
    const channels = buffer.numberOfChannels;
    const rate = buffer.sampleRate;
  
    if (start < 0) start = 0;
  
    if (end > duration) end = duration;
  
    const startOffset = rate * start;
    const endOffset = rate * end;
    const frameCount = endOffset - startOffset;
  
    const newAudioBuffer = ctx.createBuffer(
      channels,
      endOffset - startOffset,
      rate
    );
    const tempArray = new Float32Array(frameCount);
    const offset = 0;
  
    for (let channel = 0; channel < channels; channel++) {
      buffer.copyFromChannel(tempArray, channel, startOffset);
      newAudioBuffer.copyToChannel(tempArray, channel, offset);
    }
  
    return newAudioBuffer;
}

function concatAudioBuffers(
    ctx: AudioContext, 
    ...buffers: AudioBuffer[]
) {
    const numberOfChannels = Math.min(
        ...buffers.map(buffer => buffer.numberOfChannels)
    );
    const newBuffer = ctx.createBuffer(
        numberOfChannels,
        buffers.reduce((a, c) => a + c.length, 0),
        buffers[0].sampleRate
    );
    for (let i = 0; i < numberOfChannels; i++) {
        const channel = newBuffer.getChannelData(i);
        let totalLength = 0;

        for (let j = 0; j < buffers.length; j++) {
            if (j !== 0) totalLength += buffers[j-1].length;
            channel.set(buffers[j].getChannelData(i), totalLength);
        }
    }
    return newBuffer;
}

export async function spliceBlobWithBuffer(
    ctx: AudioContext,
    workingBuffer: AudioBuffer | null,
    newBlob: Blob | null,
    recStart: number,
    cb: (prog?: number, newBuffer?: AudioBuffer) => void
): Promise<void> {
    if (!newBlob) {
        cb();
        return;
    }

    const newBlobBuffer = await ctx.decodeAudioData(await newBlob.arrayBuffer());
    const newProgress = recStart + newBlobBuffer.duration;

    if (!workingBuffer) {
        cb(newProgress, newBlobBuffer);
        return;
    }

    const firstSlice = 
        recStart === 0 ? null :
        recStart >= workingBuffer.duration ? workingBuffer : 
        sliceAudioBuffer(ctx, workingBuffer, 0, recStart);
    const secondSlice = 
        newProgress > workingBuffer.duration ? null : 
        sliceAudioBuffer(ctx, workingBuffer, newProgress, workingBuffer.duration);

    function notEmpty<AudioBuffer>(value: AudioBuffer | null | undefined): value is AudioBuffer {
        return value !== null && value !== undefined;
    }

    const concatArgs: AudioBuffer[] = [firstSlice, newBlobBuffer, secondSlice].filter(notEmpty);
    const concattedBuffer = concatArgs.length === 1 ? newBlobBuffer : concatAudioBuffers(ctx, ...concatArgs);
    cb(secondSlice? newProgress : concattedBuffer.duration, concattedBuffer);
}