import { nanoid } from 'nanoid';
import { StreamRecorderTrack, generateBlankTrack } from 'cassette-js';

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
        audio: StreamRecorderTrack<"wav">;
        frequencies: number[][];
    };
    relationships: {
        user: { id: string; };
        category: { id: string | undefined; };
    };
}

const createMockStamps = () => ({
    created: Date.now(),
    modified: Date.now()
});

const createMockAudioData = (): StreamRecorderTrack<"wav"> => {
    const blankTrack = generateBlankTrack("wav");

    return {
        ...blankTrack,
        attributes: {
            ...blankTrack.attributes,
            duration: Math.floor(Math.random() * 20),
            timestamps: {
                ...createMockStamps()
            }
        }
    }
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
    data: ReturnType<typeof createMockData>,
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
        category: {
            id: undefined
        }
    }
});

export const generateNewRecordingModel = (
    userId: string
): RecordingModel => generateMockRecordingModel(
    nanoid(10),
    "",
    { created: 0, modified: 0 },
    { audio: generateBlankTrack("wav"), frequencies: [] },
    userId
);

const mockData = [
    generateMockRecordingModel('recording1', 'Recording 1', createMockStamps(), createMockData(), 'user1'),
    generateMockRecordingModel('recording2', 'Recording 2', createMockStamps(), createMockData(), 'user1'),
    generateMockRecordingModel('recording3', 'Recording 3', createMockStamps(), createMockData(), 'user1')
];

export default mockData;