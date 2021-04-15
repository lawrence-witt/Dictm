export interface CategoryModel {
    id: string;
    type: "category";
    attributes: {
        title: string;
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