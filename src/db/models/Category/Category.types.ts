export interface CategoryIndex {
    id: string;
    attributes: {
        timestamps: {
            created: number;
            modified: number;
        }
    };
    relationships: {
        user: {
            id: string;
        };
        recordings: {
            ids: string[];
        };
        notes: {
            ids: string[];
        };
    };
}

export interface CategoryModel extends CategoryIndex {
    type: "category";
    attributes: CategoryIndex["attributes"] & {
        title: string;
    }
}