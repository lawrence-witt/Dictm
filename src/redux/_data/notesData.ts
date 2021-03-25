import { nanoid } from 'nanoid';

export interface NoteModel {
    id: string;
    type: "note";
    attributes: {
        title: string;
        timestamps: {
            created: number;
            modified: number;
        }
    };
    data: {
        content: string;
        charCount: number;
        wordCount: number;
    }
    relationships: {
        user: { id: string; };
        category: { id: string; } | undefined;
    }
}

const createMockStamps = () => {
    const modified = Math.floor(Math.random() * 100000);
    return {
        created: modified - Math.floor(Math.random() * 100000),
        modified
    }
}

const createMockData = (content: string) => {
    const wordCount = Math.floor(Math.random() * 100);
    
    return {
        content,
        charCount: Math.floor(Math.random() * 5) * wordCount,
        wordCount
    }
}

const generateMockNoteModel = (
    id: string,
    title: string,
    timestamps: { created: number, modified: number },
    data: { content: string, charCount: number, wordCount: number },
    userId: string,
    categoryId?: string
): NoteModel => ({
    id,
    type: "note",
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

export const generateNewNoteModel = (
    userId: string
): NoteModel => generateMockNoteModel(
    nanoid(10),
    "",
    { created: 0, modified: 0},
    { content: "", charCount: 0, wordCount: 0 },
    userId
);

const mockData = [
    generateMockNoteModel('note1', 'Note 1', createMockStamps(), createMockData('Content of Note1'), "user1"),
    generateMockNoteModel('note2', 'Note 2', createMockStamps(), createMockData('Content of Note2'), "user1"),
    generateMockNoteModel('note3', 'Note 3', createMockStamps(), createMockData('Content of Note3'), "user1")
]

export default mockData;