export interface CategoryModel {
    id: string;
    contentType: "category";
    userId: string;
    title: string;
    recordingIds: string[];
    noteIds: string[];
    lastModified: number;
    createdAt: number;
}

const createMockTimeData = () => ({
    lastModified: Date.now(),
    createdAt: Date.now()
});

const mockData: CategoryModel[] = [
    {id: 'category1', userId: 'user1', title: 'Category1', recordingIds: [], noteIds: []},
    {id: 'category2', userId: 'user1', title: 'Category2', recordingIds: [], noteIds: []}
].map(data => Object.assign({}, data, {
    contentType: "category" as const,
    ...createMockTimeData()
}));

export default mockData;