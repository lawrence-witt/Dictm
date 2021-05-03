import User from "../../../db/models/User";

export const cloneUser = (user: User): User => ({
    ...user,
    attributes: {
        ...user.attributes,
        timestamps: {
            ...user.attributes.timestamps
        }
    },
    settings: {
        preferences: {
            ...user.settings.preferences
        },
        display: {
            sort: {
                ...user.settings.display.sort
            }
        },
        storage: {
            persistence: {
                ...user.settings.storage.persistence
            },
            threshold: {
                ...user.settings.storage.threshold
            }
        }
    }
});