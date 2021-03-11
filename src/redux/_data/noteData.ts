export interface NoteModel {
    id: string;
    userId: string;
    title: string;
    categoryId: string | null;
    content: string;
    lastModified: number;
    createdAt: number;
}

const createMockTimeData = () => ({
    lastModified: Date.now(),
    createdAt: Date.now()
});

const mockData: NoteModel[] = [
    {id: 'note1', userId: 'user1', title: 'Note1', categoryId: null, content: 'Content of Note1'},
    {id: 'note2', userId: 'user1', title: 'Note2', categoryId: null, content: 'Content of Note2'},
    {id: 'note3', userId: 'user1', title: 'Note3', categoryId: null, content: 'Content of Note3'},
].map(data => Object.assign({}, data, {
    ...createMockTimeData()
}));

export default mockData;