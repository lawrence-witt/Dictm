import { nanoid } from 'nanoid';

import { UserModel } from './User.types';

class User implements UserModel {
    id: string;
    type = "user" as const;
    attributes: UserModel["attributes"];

    constructor(name: string) {
        this.id = nanoid(10);
        this.attributes = {
            name,
            timestamps: {
                created: Date.now(),
                modified: Date.now()
            }
        }
    }
}

export const userIndexes = [
    "id", 
    "attributes.timestamps.created",
    "attributes.timestamps.modified"
].join(', ');

export default User;