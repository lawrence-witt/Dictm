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
    };
    relationships: {
        user: {
            id: string;
        };
        category: {
            id: string | undefined;
        }
    };
}