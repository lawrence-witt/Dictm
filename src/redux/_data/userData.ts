export interface UserModel {
    id: string;
    type: "user";
    attributes: {
        name: string;
        timestamps: {
            created: number;
            modified: number;
        }
    }
}

const defaultUser: UserModel = {
    id: "user1",
    type: "user",
    attributes: {
        name: "Lazarus",
        timestamps: {
            created: Date.now(),
            modified: Date.now()
        }
    }
}

export default defaultUser;