import { WavObject } from 'cassette-js';

export interface RecordingModel {
    id: string;
    contentType: "recording";
    userId: string;
    title: string;
    categoryId: string | null;
    audioData: WavObject;
    waveData: number[][];
    lastModified: number;
    createdAt: number;
}

const createMockTimeData = () => ({
    lastModified: Date.now(),
    createdAt: Date.now()
});

const createMockAudioData = () => ({
    _v: 1,
    _hL: 44,
    bytes: new Uint8Array(10000),
    duration: 10,
    sampleRate: 48000,
    ...createMockTimeData()
});

const createMockWaveData = () => {
    return Array.from({
        length: 10}, () => Array.from(
            {length: 10}, () => Math.floor(Math.random() * 150)
        )
    );
};

const mockData: RecordingModel[] = [
    {id: 'recording1', userId: 'user1', title: 'Recording 1', categoryId: null},
    {id: 'recording2', userId: 'user1', title: 'Recording 2', categoryId: null},
    {id: 'recording3', userId: 'user1', title: 'Recording 3', categoryId: null}
].map(data => Object.assign({}, data, {
    contentType: "recording" as const,
    audioData: createMockAudioData(),
    waveData: createMockWaveData(),
    ...createMockTimeData()
}));

export default mockData;