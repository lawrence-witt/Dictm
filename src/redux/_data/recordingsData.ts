import { nanoid } from 'nanoid';
import { WavObject, blankWavObject } from 'cassette-js';

export interface RecordingModel {
    id: string;
    type: "recording";
    attributes: {
        title: string;
        timestamps: {
            created: number;
            modified: number;
        }
    };
    data: {
        audio: WavObject;
        frequencies: number[][];
    };
    relationships: {
        user: { id: string; };
        category: { id: string; } | undefined;
    };
}

const createMockStamps = () => ({
    created: Date.now(),
    modified: Date.now()
});

const createMockAudioData = (): WavObject => {
    return Object.assign({}, {
        ...blankWavObject,
        data: {
            ...blankWavObject.data,
            bytes: new Uint8Array(10000),
            duration: 10
        },
        attributes: {
            timestamps: {
                ...createMockStamps()
            }
        }
    })
}

const createMockFrequenciesData = () => {
    return Array.from({
        length: 10}, () => Array.from(
            {length: 10}, () => Math.floor(Math.random() * 150)
        )
    );
};

const createMockData = () => ({
    audio: createMockAudioData(),
    frequencies: createMockFrequenciesData()
});

const generateMockRecordingModel = (
    id: string,
    title: string,
    timestamps: { created: number, modified: number },
    data: { audio: WavObject, frequencies: number[][] },
    userId: string,
    categoryId?: string
): RecordingModel => ({
    id,
    type: "recording",
    attributes: {
        title,
        timestamps
    },
    data,
    relationships: {
        user: {
            id: userId
        },
        category: undefined
    }
});

export const generateNewRecordingModel = (
    userId: string
): RecordingModel => generateMockRecordingModel(
    nanoid(10),
    "",
    { created: 0, modified: 0 },
    { audio: blankWavObject, frequencies: [] },
    userId
);

const mockData = [
    generateMockRecordingModel('recording1', 'Recording 1', createMockStamps(), createMockData(), 'user1'),
    generateMockRecordingModel('recording2', 'Recording 2', createMockStamps(), createMockData(), 'user1'),
    generateMockRecordingModel('recording3', 'Recording 3', createMockStamps(), createMockData(), 'user1')
];

export default mockData;