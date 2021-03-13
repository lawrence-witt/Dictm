export interface NoteModel {
    id: string;
    contentType: "note";
    userId: string;
    title: string;
    categoryId: string | null;
    content: string;
    details: {
        wordCount: number;
        charCount: number;
    };
    lastModified: number;
    createdAt: number;
}

const createMockTimeData = () => ({
    lastModified: Date.now(),
    createdAt: Date.now()
});

const createMockDetailsData = () => ({
    wordCount: Math.floor(Math.random() * 50),
    charCount: Math.floor(Math.random() * 300)
})

const mockData: NoteModel[] = [
    {id: 'note1', userId: 'user1', title: 'Note1', categoryId: null, content: 'Content of Note1'},
    {id: 'note2', userId: 'user1', title: 'Note2', categoryId: null, content: 'Content of Note2'},
    {id: 'note3', userId: 'user1', title: 'Note3', categoryId: null, content: 'Content of Note3'},
].map(data => Object.assign({}, data, {
    contentType: "note" as const,
    details: createMockDetailsData(),
    ...createMockTimeData()
}));

export const generateNoteModel = (
    userId: string
): NoteModel => ({
    id: "new",
    contentType: "note",
    userId,
    title: "",
    categoryId: null,
    content: "",
    details: {
        wordCount: 0,
        charCount: 0
    },
    lastModified: 0,
    createdAt: 0
});

export default mockData;