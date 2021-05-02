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
            threshold: {
                ...user.settings.storage.threshold
            }
        }
    }
});