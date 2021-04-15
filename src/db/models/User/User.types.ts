export interface UserModel {
    id: string;
    type: "user";
    attributes: {
        name: string;
        timestamps: {
            created: number;
            modified: number;
        }
    };
    preferences: {
        greeting: string;
    }
}