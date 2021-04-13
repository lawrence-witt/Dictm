export interface NoteIndex {
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
        category: {
            id: string | undefined;
        };
    }
}

export interface NoteModel extends NoteIndex {
    type: "note";
    attributes: NoteIndex["attributes"] & {
        title: string;
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
    }
}