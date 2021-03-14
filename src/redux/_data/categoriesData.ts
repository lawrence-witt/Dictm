import { nanoid } from 'nanoid';

export interface CategoryModel {
    id: string;
    type: "category";
    attributes: {
        title: string;
        timestamps: {
            created: number;
            modified: number;
        };
    };
    relationships: {
        user: { id: string };
        recordings: { ids: string[]; };
        notes: { ids: string[]; };
    };
}

const createMockStamps = () => ({
    created: Date.now(),
    modified: Date.now()
});

const generateMockCategoryModel = (
    id: string,
    title: string,
    timestamps: ReturnType<typeof createMockStamps>,
    recordingIds: string[],
    noteIds: string[],
    userId: string
): CategoryModel => ({
    id,
    type: "category",
    attributes: {
        title,
        timestamps
    },
    relationships: {
        user: { id: userId },
        recordings: { ids: recordingIds },
        notes: { ids: noteIds }
    }
});

export const generateNewCategoryModel = (
    userId: string
): CategoryModel => generateMockCategoryModel(
    nanoid(10),
    "",
    { created: 0, modified: 0 },
    [],
    [],
    userId
);

const mockData = [
    generateMockCategoryModel('category1', 'Category 1', createMockStamps(), [], [], 'user1'),
    generateMockCategoryModel('category1', 'Category 2', createMockStamps(), [], [], 'user1')
]

export default mockData;