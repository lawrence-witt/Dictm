export interface UserIndex {
    id: string;
    attributes: {
        timestamps: {
            created: number;
            modified: number;
        }
    }
}

export interface UserModel extends UserIndex {
    type: "user";
    attributes: UserIndex["attributes"] & {
        name: string;
    }
}