import lamejs from 'lamejs';

function float32ToInt16(float32) {
    let i = 0;
    const dataAsInt16Array = new Int16Array(float32.length);

    while (i < float32.length) {
        dataAsInt16Array[i] = convert(float32[i++]);
    }

    function convert(n) {
        var v = n < 0 ? n * 32768 : n * 32767; // convert in range [-32768, 32767]
        return Math.max(-32768, Math.min(32768, v)); // clamp
    }

    return dataAsInt16Array;
}

onmessage = function(event) {
    const { numChannels, sampleRate, float32Channels, kbps } = event.data;

    const channelData = [];
    const blockSize = 1152;
    const blocks = [];

    for (let i = 0; i < numChannels; i++) {
        channelData.push(float32ToInt16(float32Channels[i]));
    }

    let mp3Buffer;
    const mp3Encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
    const length = channelData[0].length;

    let lastProgress = 0;

    for (let i = 0; i < length; i += blockSize) {
        const newProgress = Math.floor((i/length)*100);
        if (newProgress > lastProgress) {
            lastProgress = newProgress;
            postMessage({type: 'progress', payload: newProgress});
        }

        const subChannels = channelData.map(channel => (
            channel.subarray(i, i + blockSize)
        ));
        mp3Buffer = mp3Encoder.encodeBuffer(...subChannels);
        mp3Buffer.length > 0 && blocks.push(mp3Buffer);
    }

    mp3Buffer = mp3Encoder.flush();
    mp3Buffer.length > 0 && blocks.push(mp3Buffer);
    postMessage({type: 'progress', payload: 100});
    postMessage({type: 'complete', payload: blocks});
};