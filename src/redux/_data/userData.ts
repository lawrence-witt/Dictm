export interface UserModel {
    id: string;
    type: "user";
    attributes: {
        name: string;
    }
}

const defaultUser: UserModel = {
    id: "user1",
    type: "user",
    attributes: {
        name: "Lazarus"
    }
}

export default defaultUser;