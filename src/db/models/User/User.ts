import { nanoid } from 'nanoid';

import { UserModel } from './User.types';

class User implements UserModel {
    id: string;
    type = "user" as const;
    attributes: UserModel["attributes"];
    settings: UserModel["settings"];

    constructor(name: string, greeting: string) {
        this.id = nanoid(10);
        this.attributes = {
            name,
            timestamps: {
                created: Date.now(),
                modified: Date.now()
            }
        }
        this.settings = {
            preferences: {
                greeting
            },
            display: {
                sort: {
                    recordings: 'createdAsc',
                    notes: 'createdAsc',
                    categories: 'createdAsc',
                    mixed: 'createdAsc'
                }
            },
            storage: {
                persistence: {
                    prompted: false
                },
                threshold: {
                    value: 500,
                    unit: "MB"
                }
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